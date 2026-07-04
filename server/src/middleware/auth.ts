import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { AppError } from './errorHandler';

export interface JwtPayload {
  userId: string;
  role: string;
}

/**
 * Verifies the JWT access token from the Authorization header (Bearer <token>)
 * or the httpOnly cookie, then attaches the full user document to req.user.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to httpOnly cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken as string;
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (user.status === 'Suspended') {
      throw new AppError('Your account has been suspended', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
