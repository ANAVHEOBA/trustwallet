import mongoose, { Document } from 'mongoose';
import walletSchema from './wallet.schema';

export interface IWalletSecurity {
  hasPin: boolean;
  pin?: string;
  pinSalt?: string;
  hasBiometrics: boolean;
  lastAccessed: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  walletAddress: string;
  encryptedSeedPhrase: string;
  iv: string;
  salt: string;
  name: string;
  isDefault: boolean;
  isVerified: boolean;
  isLoggedOut: boolean;
  lastLogout: Date | null;
  security: IWalletSecurity;
  status: 'active' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletMethods {
  isActive(): boolean;
  hasValidPin(): boolean;
}

export interface WalletModel extends mongoose.Model<IWallet, {}, IWalletMethods> {
  findByAddress(walletAddress: string): Promise<IWallet | null>;
  findDefaultWallet(userId: mongoose.Types.ObjectId): Promise<IWallet | null>;
}

// Add methods
walletSchema.methods.isActive = function(): boolean {
  return this.status === 'active';
};

walletSchema.methods.hasValidPin = function(): boolean {
  return this.security.hasPin && !!this.security.pin;
};

// Add static methods
walletSchema.statics.findByAddress = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

walletSchema.statics.findDefaultWallet = function(userId: mongoose.Types.ObjectId) {
  return this.findOne({ userId, isDefault: true });
};

const Wallet = mongoose.model<IWallet, WalletModel>('Wallet', walletSchema);

export default Wallet; 