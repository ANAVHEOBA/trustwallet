import mongoose from 'mongoose';
import { CryptoSymbol, GIVEAWAY_AMOUNTS, CryptoMetrics, CryptoBalance } from './crypto.types';

// Local interface for schema definition
interface ICryptoBalanceSchema extends CryptoBalance {
  symbol: CryptoSymbol;
  amount: number;
  priceUsd: number;
  value: number;
  lastUpdated: Date;
  metrics: CryptoMetrics;
}

const cryptoBalanceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    enum: Object.keys(GIVEAWAY_AMOUNTS),
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  priceUsd: {
    type: Number,
    required: true,
    default: 0
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  metrics: {
    price: {
      type: Number,
      default: 0
    },
    marketCap: {
      type: Number,
      default: 0
    },
    volume24h: {
      type: Number,
      default: 0
    },
    priceChange24h: {
      type: Number,
      default: 0
    },
    liquidity: {
      type: Number,
      default: 0
    }
  }
});

const cryptoWalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  balances: [cryptoBalanceSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.balances = ret.balances.map((balance: ICryptoBalanceSchema) => ({
        ...balance,
        value: balance.amount * balance.priceUsd
      }));
      return ret;
    }
  }
});

// Add method to initialize giveaway amounts
cryptoWalletSchema.methods.initializeGiveaway = function() {
  console.log('Initializing giveaway with amounts:', GIVEAWAY_AMOUNTS);
  const entries = Object.entries(GIVEAWAY_AMOUNTS) as Array<[CryptoSymbol, number]>;
  this.balances = entries.map(([symbol, amount]) => ({
    symbol,
    amount,
    priceUsd: 0,
    value: 0,
    lastUpdated: new Date(),
    metrics: {
      price: 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      liquidity: 0
    }
  }));
  console.log('Initialized balances:', this.balances);
};

// Add method to update prices
cryptoWalletSchema.methods.updatePrices = function(metrics: Record<CryptoSymbol, CryptoMetrics>) {
  this.balances = this.balances.map((balance: ICryptoBalanceSchema) => ({
    ...balance,
    priceUsd: metrics[balance.symbol as CryptoSymbol]?.price || balance.priceUsd,
    value: balance.amount * (metrics[balance.symbol as CryptoSymbol]?.price || balance.priceUsd),
    metrics: metrics[balance.symbol as CryptoSymbol] || balance.metrics,
    lastUpdated: new Date()
  }));
};

export default cryptoWalletSchema; 