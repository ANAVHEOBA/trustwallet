import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CryptoService } from '../crypto/crypto.service';
import authMiddleware from '../../middleware/auth.middleware';

class WalletRouter {
  private static instance: Router | null = null;
  private static controller: WalletController | null = null;

  static initialize(cryptoService: CryptoService): Router {
    if (!WalletRouter.instance) {
      const router = Router();
      const walletService = new WalletService(cryptoService);
      WalletRouter.controller = new WalletController(walletService);

      // Public routes
      router.post('/generate', (req, res) => WalletRouter.controller!.generateWallet(req, res));
      router.post('/verify', (req, res) => WalletRouter.controller!.verifyAndCreateWallet(req, res));
      router.post('/import', (req, res) => WalletRouter.controller!.importWallet(req, res));

      // Protected routes
      router.use(authMiddleware);
      router.get('/', (req, res) => WalletRouter.controller!.getWallets(req, res));
      router.post('/:walletAddress/logout', (req, res) => WalletRouter.controller!.logoutWallet(req, res));
      
      // Transfer endpoint (protected)
      router.post('/transfer', async (req, res) => {
        await WalletRouter.controller!.transferRequest(req, res);
      });

      WalletRouter.instance = router;
    }
    return WalletRouter.instance;
  }
}

// Export the initialize function bound to the class
export default WalletRouter.initialize.bind(WalletRouter); 