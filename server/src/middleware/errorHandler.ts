import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── Zod validation error ──────────────────────────────────────────────────
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // ── Known operational error ───────────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // ── MongoDB duplicate key ─────────────────────────────────────────────────
  if ((err as NodeJS.ErrnoException).code === '11000' || (err as any).code === 11000) {
    const keyValue = (err as any).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? 'field';
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  // ── Mongoose cast error (invalid ObjectId) ────────────────────────────────
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  // ── Mongoose validation error ─────────────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ success: false, message: messages[0] });
    return;
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' });
    return;
  }

  // ── Unknown error — never expose internals in production ──────────────────
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
