import { Document } from 'mongoose';

export interface CryptoMetrics {
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  liquidity: number;
}

export interface CryptoBalance {
  symbol: string;
  amount: number;
  priceUsd: number;
  value: number;
  lastUpdated: Date;
  metrics?: CryptoMetrics;
}

export interface ICryptoWallet extends Document {
  userId: string;
  walletAddress: string;
  balances: CryptoBalance[];
  initializeGiveaway(): void;
  updatePrices(prices: Record<CryptoSymbol, CryptoMetrics>): void;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  priceUsd: string;
  marketCap: number;
  fdv: number;
  volume: {
    h24: string;
  };
  priceChange: {
    h24: string;
  };
  liquidity: {
    usd: string;
  };
}

export interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
  pair: DexScreenerPair | null;
  schemaVersion: string;
}

export const GIVEAWAY_AMOUNTS = {
  BTC: 5,
  ETH: 100
} as const;

export type CryptoSymbol = keyof typeof GIVEAWAY_AMOUNTS;

export const PAIR_ADDRESSES = {
  BTC: "bsc/0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082", // BTCB/BUSD PancakeSwap v2
  ETH: "bsc/0x74E4716E431f45807DCF19f284c7aA99F18a4fbc"  // ETH/BUSD PancakeSwap v2
} as const;

export const TOKEN_ADDRESSES = {
  BTC: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTCB on BSC
  ETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"  // ETH on BSC
} as const;

export interface DexScreenerToken {
  price: string;
  volume: string;
  liquidity: string;
  fdv: string;
  priceChange: {
    h24: string;
  };
}

export interface DexScreenerTokenResponse {
  pairs: {
    [key: string]: DexScreenerToken;
  };
} 