import { Router } from 'express';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import authMiddleware from '../../middleware/auth.middleware';

class CryptoRouter {
  private static instance: Router | null = null;
  private static controller: CryptoController | null = null;

  static initialize(cryptoService: CryptoService): Router {
    if (!CryptoRouter.instance) {
      const router = Router();
      CryptoRouter.controller = new CryptoController(cryptoService);

      // Public routes
      router.get('/prices', (req, res) => CryptoRouter.controller!.getCurrentPrices(req, res));

      // Protected routes
      router.use(authMiddleware);
      router.get('/:walletAddress/balances', (req, res) => CryptoRouter.controller!.getBalances(req, res));
      router.post('/update-prices', (req, res) => CryptoRouter.controller!.updatePrices(req, res));

      CryptoRouter.instance = router;
    }
    return CryptoRouter.instance;
  }
}

// Export the initialize function bound to the class
export default CryptoRouter.initialize.bind(CryptoRouter); 