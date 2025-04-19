import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Session } from 'express-session';

// Session extension
declare module 'express-session' {
  interface SessionData {
    tempSeedPhrase?: string;
    tempWalletAddress?: string;
  }
}

// JWT payload extension
export interface CustomJwtPayload extends JwtPayload {
  id: string;
  walletAddress?: string;
  userId: string;  // Required to match JwtPayload
  role: string;    // Required to match JwtPayload
}

// Express request extension with generics
export interface CustomRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: CustomJwtPayload;
  session: Session & Partial<SessionData>;
}

interface SessionData {
  tempSeedPhrase: string;
  tempWalletAddress: string;
}

export interface WalletCreationResponse {
  seedPhrase: string;
  walletAddress: string;
  message: string;
}

export interface WalletVerificationRequest {
  selectedWords: { index: number; word: string }[];
  walletAddress: string;
}

export interface ImportWalletRequest {
  seedPhrase: string;
}

export interface WalletResponse {
  walletAddress: string;
  name?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface VerificationChallenge {
  indices: number[];  // Indices of words user needs to verify
  options: string[];  // Word options including correct and incorrect choices
}

export interface WalletSecuritySettings {
  hasPin: boolean;
  hasBiometrics: boolean;
  lastAccessed: Date;
} 