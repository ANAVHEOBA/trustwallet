import express, { Express } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import walletRouterInit from './modules/wallet/wallet.router';
import cryptoRouterInit from './modules/crypto/crypto.router';
import { CryptoService } from './modules/crypto/crypto.service';
import CryptoWallet from './modules/crypto/crypto.model';

class App {
  public app: Express;
  private cryptoService!: CryptoService;

  constructor() {
    this.app = express();
    this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private initializeServices(): void {
    // Initialize CryptoService with the real MongoDB model
    this.cryptoService = new CryptoService(CryptoWallet);
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", "https://trustwalletfrontend.vercel.app", "https://api.dexscreener.com", "https://trustwallet-r0ch.onrender.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }));

    // CORS configuration
    const allowedOrigins = [
      'https://trustwalletfrontend.vercel.app',
      'http://localhost:3000',
      'https://trustwallet-r0ch.onrender.com'
    ];

    this.app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400 // 24 hours
    }));

    // Request parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    this.app.use(morgan('dev'));

    // Session management
    this.app.use(
      session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: config.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax'
        }
      })
    );
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/wallet', walletRouterInit(this.cryptoService));
    this.app.use('/api/crypto', cryptoRouterInit(this.cryptoService));

    // Error handling
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        error: config.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });
  }
}

export default new App().app;
