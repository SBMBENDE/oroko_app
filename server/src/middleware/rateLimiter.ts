import rateLimit from 'express-rate-limit';

const json = (message: string) => ({ success: false, message });

/**
 * General API rate limit — 100 requests per 15 minutes per IP.
 * Applied globally in app.ts.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: json('Too many requests, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth endpoints (login, forgot-password) — 5 attempts per 15 minutes per IP.
 * Prevents brute-force and credential stuffing attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: json('Too many attempts, please try again in 15 minutes'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Messaging — 20 messages per minute per IP (will be per-user once auth is applied).
 */
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: json('Message rate limit exceeded, please slow down'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File uploads — 5 uploads per minute per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: json('Upload rate limit exceeded, please wait before uploading again'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Registration — 3 registrations per hour per IP.
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: json('Too many registration attempts from this IP'),
  standardHeaders: true,
  legacyHeaders: false,
});
