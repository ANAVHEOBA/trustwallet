import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import CryptoWallet from './crypto.model';
import { 
  CryptoSymbol, 
  DexScreenerResponse, 
  ICryptoWallet, 
  PAIR_ADDRESSES,
  CryptoMetrics 
} from './crypto.types';

@Injectable()
export class CryptoService {
  constructor(
    @InjectModel('CryptoWallet') private readonly cryptoWalletModel: Model<ICryptoWallet>,
  ) {}

  async initializeGiveaway(userId: string, walletAddress: string): Promise<ICryptoWallet> {
    try {
      console.log('Creating crypto wallet for:', { userId, walletAddress });
      const cryptoWallet = await this.cryptoWalletModel.create({
        userId,
        walletAddress: walletAddress.toLowerCase(),
        balances: []
      });

      console.log('Initializing giveaway balances');
      cryptoWallet.initializeGiveaway();
      
      // Fetch current prices and update the wallet
      const metrics = await this.fetchAllPrices();
      cryptoWallet.updatePrices(metrics);
      
      // Save the wallet with initialized balances
      await cryptoWallet.save();
      
      console.log('Wallet initialized with balances:', cryptoWallet.balances);
      return cryptoWallet;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to initialize giveaway:', errorMessage);
      throw new Error(`Failed to initialize giveaway: ${errorMessage}`);
    }
  }

  private async fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          return response;
        }
        
        console.warn(`Attempt ${i + 1}/${retries} failed with status ${response.status}`);
      } catch (error) {
        console.warn(`Attempt ${i + 1}/${retries} failed:`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Failed after ${retries} attempts`);
  }

  async fetchPrice(symbol: CryptoSymbol): Promise<CryptoMetrics> {
    try {
      const pairAddress = PAIR_ADDRESSES[symbol];
      const url = `https://api.dexscreener.com/latest/dex/pairs/${pairAddress}`;

      const response = await this.fetchWithRetry(url);
      const jsonData = await response.json();
      
      // Type guard to verify the response shape
      const isDexScreenerResponse = (data: any): data is DexScreenerResponse => {
        return (
          typeof data === 'object' &&
          data !== null &&
          (
            (Array.isArray(data.pairs) || data.pairs === null) ||
            (typeof data.pair === 'object' || data.pair === null)
          )
        );
      };

      if (!isDexScreenerResponse(jsonData)) {
        throw new Error('Invalid response format from DexScreener API');
      }

      const data: DexScreenerResponse = jsonData;
      const pair = data.pairs?.[0] || data.pair;

      if (pair) {
        const metrics: CryptoMetrics = {
          price: parseFloat(pair.priceUsd) || 0,
          marketCap: pair.marketCap || 0,
          volume24h: parseFloat(pair.volume?.h24) || 0,
          priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
          liquidity: parseFloat(pair.liquidity?.usd) || 0
        };

        console.log(`Fetched ${symbol} metrics:`, metrics);
        return metrics;
      }

      console.warn(`No data available for ${symbol}`);
      return {
        price: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        liquidity: 0
      };
    } catch (error) {
      console.error(`Failed to fetch ${symbol} metrics after retries:`, error);
      return {
        price: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        liquidity: 0
      };
    }
  }

  async fetchAllPrices(): Promise<Record<CryptoSymbol, CryptoMetrics>> {
    const metrics: Partial<Record<CryptoSymbol, CryptoMetrics>> = {};
    
    // Fetch metrics in parallel
    const symbols = Object.keys(PAIR_ADDRESSES) as CryptoSymbol[];
    await Promise.all(
      symbols.map(async (symbol) => {
        metrics[symbol] = await this.fetchPrice(symbol);
      })
    );

    return metrics as Record<CryptoSymbol, CryptoMetrics>;
  }

  async updateAllWalletPrices(): Promise<void> {
    try {
      const metrics = await this.fetchAllPrices();
      const wallets = await this.cryptoWalletModel.find();

      // Update all wallets in parallel
      await Promise.all(
        wallets.map(async (wallet) => {
          wallet.updatePrices(metrics);
          await wallet.save();
        })
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update wallet prices: ${errorMessage}`);
    }
  }

  async getWalletBalances(walletAddress: string): Promise<ICryptoWallet> {
    try {
      const wallet = await this.cryptoWalletModel.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      
      if (!wallet) {
        throw new Error('Crypto wallet not found');
      }

      const metrics = await this.fetchAllPrices();
      wallet.updatePrices(metrics);
      await wallet.save();
      return wallet;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get wallet balances: ${errorMessage}`);
    }
  }
} 