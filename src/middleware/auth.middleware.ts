import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { CustomJwtPayload } from '../modules/wallet/wallet.types';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as CustomJwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
  }
};

export default authMiddleware;
