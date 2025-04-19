import { Response, Request } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { Controller, Post, Get, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { config } from '../../config/environment';
import { WalletService } from './wallet.service';
import { IWallet } from './wallet.model';
import { 
  CustomRequest, 
  WalletVerificationRequest,
  ImportWalletRequest
} from './wallet.types';
import { ADMIN_CONTACT } from '../../config/constants';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Step 1: Generate new wallet with seed phrase
  @Post('generate')
  async generateWallet(@Req() req: CustomRequest, @Res() res: Response): Promise<void> {
    try {
      const walletData = await this.walletService.generateNewWallet();
      
      res.json({
        success: true,
        data: walletData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate wallet'
      });
    }
  }

  // Step 2: Verify seed phrase and create wallet
  @Post('verify')
  async verifyAndCreateWallet(
    @Req() req: CustomRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const { seedPhrase } = req.body;

      if (!seedPhrase) {
        res.status(400).json({
          success: false,
          error: 'Seed phrase is required'
        });
        return;
      }

      // Generate a new user ID for the initial wallet
      const userId = new Types.ObjectId();

      // Create the wallet
      const wallet = await this.walletService.createWallet(userId, seedPhrase);

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: userId.toString(),
          walletAddress: wallet.walletAddress,
          role: 'user'
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          walletAddress: wallet.walletAddress,
          message: 'Wallet created successfully'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create wallet'
      });
    }
  }

  // Import existing wallet
  @Post('import')
  async importWallet(
    @Req() req: CustomRequest<{}, any, ImportWalletRequest>,
    @Res() res: Response
  ): Promise<void> {
    try {
      const { seedPhrase } = req.body;
      
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const userId = new Types.ObjectId(req.user.id);
      const wallet = await this.walletService.importWallet(userId, seedPhrase);

      res.status(201).json({
        success: true,
        data: {
          walletAddress: wallet.walletAddress,
          message: 'Wallet imported successfully'
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import wallet'
      });
    }
  }

  // Get user's wallets
  @Get()
  async getWallets(@Req() req: CustomRequest, @Res() res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const userId = new Types.ObjectId(req.user.id);
      const wallets = await this.walletService.getWallets(userId);
      
      res.json({
        success: true,
        data: {
          wallets: wallets.map((wallet: IWallet) => ({
            walletAddress: wallet.walletAddress,
            name: wallet.name,
            isDefault: wallet.isDefault,
            isVerified: wallet.isVerified,
            security: {
              hasPin: wallet.security.hasPin,
              hasBiometrics: wallet.security.hasBiometrics,
              lastAccessed: wallet.security.lastAccessed
            },
            status: wallet.status,
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch wallets'
      });
    }
  }

  // Logout wallet
  @Post('logout/:walletAddress')
  async logoutWallet(@Req() req: CustomRequest<{ walletAddress: string }>, @Res() res: Response): Promise<void> {
    try {
      const { walletAddress } = req.params;
      
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const userId = new Types.ObjectId(req.user.id);

      // Get the wallet
      const wallets = await this.walletService.getWallets(userId);
      const userWallet = wallets.find((w: IWallet) => w.walletAddress.toLowerCase() === walletAddress.toLowerCase());
      
      if (!userWallet) {
        res.status(403).json({
          success: false,
          error: 'You do not have permission to logout this wallet'
        });
        return;
      }

      await this.walletService.logoutWallet(walletAddress);
      
      res.json({
        success: true,
        message: 'Wallet logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to logout wallet'
      });
    }
  }

  async transferRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { toAddress, amount, symbol } = req.body;

      if (!toAddress || !amount || !symbol) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: toAddress, amount, and symbol are required'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          message: ADMIN_CONTACT.MESSAGE,
          contactEmail: ADMIN_CONTACT.EMAIL,
          emailSubject: ADMIN_CONTACT.SUBJECT,
          requestDetails: {
            fromAddress: req.user?.walletAddress,
            toAddress,
            amount,
            symbol,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Transfer request error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process transfer request'
      });
    }
  }
} 