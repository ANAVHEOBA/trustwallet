import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { CustomRequest } from '../wallet/wallet.types';
import { CryptoService } from './crypto.service';

@Injectable()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  async getBalances(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const walletAddress = req.params.walletAddress.toLowerCase();
      const cryptoWallet = await this.cryptoService.getWalletBalances(walletAddress);

      res.json({
        success: true,
        data: {
          balances: cryptoWallet.balances,
          totalValue: cryptoWallet.balances.reduce((sum, b) => sum + b.value, 0)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balances'
      });
    }
  }

  async getCurrentPrices(req: CustomRequest, res: Response): Promise<void> {
    try {
      const prices = await this.cryptoService.fetchAllPrices();
      
      res.json({
        success: true,
        data: {
          prices,
          timestamp: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch prices'
      });
    }
  }

  // This would typically be called by a cron job
  async updatePrices(req: CustomRequest, res: Response): Promise<void> {
    try {
      await this.cryptoService.updateAllWalletPrices();
      
      res.json({
        success: true,
        message: 'Prices updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update prices'
      });
    }
  }
} 