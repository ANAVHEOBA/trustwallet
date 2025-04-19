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
    this.app.use(helmet());
    this.app.use(cors());

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
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
