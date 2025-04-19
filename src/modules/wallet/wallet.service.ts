import * as bip39 from 'bip39';
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import Wallet, { IWallet } from './wallet.model';
import { VerificationChallenge, WalletCreationResponse } from './wallet.types';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class WalletService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;

  constructor(private readonly cryptoService: CryptoService) {}

  async generateNewWallet(): Promise<WalletCreationResponse> {
    // Generate a random 12-word mnemonic
    const seedPhrase = bip39.generateMnemonic(128);
    const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

    return {
      seedPhrase,
      walletAddress: wallet.address,
      message: 'IMPORTANT: Write down these 12 words in order and keep them safe. They are the only way to recover your wallet.'
    };
  }

  async createVerificationChallenge(seedPhrase: string): Promise<VerificationChallenge> {
    const words = seedPhrase.split(' ');
    // Randomly select 3 words to verify
    const indices = this.getRandomIndices(words.length, 3);
    
    // For each word, add 3 random similar words as options
    const options = indices.map(index => {
      const correctWord = words[index];
      const similarWords = this.generateSimilarWords(correctWord);
      return [...similarWords, correctWord].sort(() => Math.random() - 0.5);
    });

    return {
      indices,
      options: options.flat()
    };
  }

  async verifySelectedWords(seedPhrase: string, selectedWords: { index: number; word: string }[]): Promise<boolean> {
    const words = seedPhrase.split(' ');
    return selectedWords.every(selection => words[selection.index] === selection.word);
  }

  private async generateEncryptionKey(seedPhrase: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(seedPhrase, salt, 100000, this.keyLength, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }

  async encryptSeedPhrase(seedPhrase: string): Promise<{ encryptedData: string; iv: string; salt: string }> {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(this.ivLength);
    const key = await this.generateEncryptionKey(seedPhrase, salt);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(seedPhrase, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted + authTag.toString('hex'),
      iv: iv.toString('hex'),
      salt: salt.toString('hex')
    };
  }

  async createWallet(userId: Types.ObjectId, seedPhrase: string, pin?: string): Promise<IWallet> {
    // Validate seed phrase
    if (!bip39.validateMnemonic(seedPhrase)) {
      throw new Error('Invalid seed phrase');
    }

    // Create wallet from seed phrase
    const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
    const walletAddress = wallet.address.toLowerCase();
    
    // Check if wallet already exists
    const existingWallet = await Wallet.findByAddress(walletAddress);
    if (existingWallet) {
      // If wallet exists and is logged out, allow reuse
      if (existingWallet.isLoggedOut) {
        existingWallet.userId = userId;
        existingWallet.isLoggedOut = false;
        existingWallet.lastLogout = null;
        await existingWallet.save();
        return existingWallet;
      }
      throw new Error('This wallet address is already in use');
    }

    // Encrypt seed phrase
    const { encryptedData, iv, salt } = await this.encryptSeedPhrase(seedPhrase);

    // Check if this is the first wallet for the user
    const existingWallets = await Wallet.find({ userId });
    const isDefault = existingWallets.length === 0;

    // Create wallet document
    const newWallet = await Wallet.create({
      userId,
      walletAddress,
      encryptedSeedPhrase: encryptedData,
      iv,
      salt,
      isDefault,
      isVerified: false,
      security: {
        hasPin: !!pin,
        pin: pin ? await this.hashPin(pin) : undefined,
        hasBiometrics: false
      }
    });

    // Initialize crypto giveaway for the new wallet
    await this.cryptoService.initializeGiveaway(userId.toString(), newWallet.walletAddress);

    return newWallet;
  }

  async importWallet(userId: Types.ObjectId, seedPhrase: string): Promise<IWallet> {
    if (!bip39.validateMnemonic(seedPhrase)) {
      throw new Error('Invalid seed phrase');
    }

    const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
    
    // Check if wallet already exists
    const existingWallet = await Wallet.findByAddress(wallet.address);
    if (existingWallet) {
      // Allow import if wallet is logged out
      if (!existingWallet.isLoggedOut) {
        throw new Error('Wallet is currently in use by another account');
      }

      // Update wallet ownership and reset status
      existingWallet.userId = userId;
      existingWallet.isLoggedOut = false;
      existingWallet.lastLogout = null;
      existingWallet.isDefault = false; // New imports shouldn't be default
      await existingWallet.save();
      
      return existingWallet;
    }

    return this.createWallet(userId, seedPhrase);
  }

  private async hashPin(pin: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(pin, salt, 100000, 32, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex') + '.' + salt.toString('hex'));
      });
    });
  }

  private getRandomIndices(max: number, count: number): number[] {
    const indices = new Set<number>();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
  }

  private generateSimilarWords(word: string): string[] {
    // In a real implementation, you would use a dictionary or algorithm
    // to generate similar-looking or similar-sounding words
    // For now, we'll just modify the word slightly
    return [
      word.slice(1),
      word + 's',
      word.charAt(0) + word.slice(2)
    ];
  }

  async getWallets(userId: Types.ObjectId): Promise<IWallet[]> {
    try {
      // Find all wallets belonging to the user
      const wallets = await Wallet.find({ 
        userId,
        status: 'active' 
      }).sort({ 
        isDefault: -1,  // Default wallet first
        createdAt: -1   // Then most recent
      });

      return wallets;
    } catch (error) {
      throw new Error('Failed to fetch wallets');
    }
  }

  async logoutWallet(walletAddress: string): Promise<void> {
    const wallet = await Wallet.findByAddress(walletAddress);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.isLoggedOut = true;
    wallet.lastLogout = new Date();
    await wallet.save();
  }
} 