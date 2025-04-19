import mongoose from 'mongoose';
import cryptoWalletSchema from './crypto.schema';
import { ICryptoWallet } from './crypto.types';

interface CryptoWalletModel extends mongoose.Model<ICryptoWallet> {
  findByWalletAddress(walletAddress: string): Promise<ICryptoWallet | null>;
}

// Add static methods
cryptoWalletSchema.statics.findByWalletAddress = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

const CryptoWallet = mongoose.model<ICryptoWallet, CryptoWalletModel>('CryptoWallet', cryptoWalletSchema);

export default CryptoWallet; 