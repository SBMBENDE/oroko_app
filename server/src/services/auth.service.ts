import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Response } from 'express';
import { env } from '../config/env';
import { Role } from '../types/enums';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ── Token generation ──────────────────────────────────────────────────────────

export function generateTokens(userId: string, role: Role): TokenPair {
  const accessToken = jwt.sign(
    { userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
  const refreshToken = jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}

// ── Password hashing ──────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Token utilities ───────────────────────────────────────────────────────────

/** SHA-256 hash of a token for safe storage in MongoDB */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Generate a cryptographically secure random token */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ── Cookie management ─────────────────────────────────────────────────────────

export function setAuthCookies(res: Response, tokens: TokenPair): void {
  const isProd = env.NODE_ENV === 'production';
  const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'strict' : 'lax') as 'strict' | 'lax',
  };

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieBase,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie is scoped to the refresh endpoint only
  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
}
