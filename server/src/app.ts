import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sanitize } from './middleware/sanitize';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/members.routes';
import executiveRoutes from './routes/executives.routes';
import adminRoutes from './routes/admin.routes';
import chapterRoutes from './routes/chapters.routes';
import messageRoutes from './routes/messages.routes';
import notificationRoutes from './routes/notifications.routes';

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow the configured frontend origin ──────────────────────────
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parsing (10 kb limit prevents oversized payload attacks) ─────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── NoSQL injection prevention ────────────────────────────────────────────────
app.use(sanitize);

// ── General rate limit (applied before all routes) ───────────────────────────
app.use(generalLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'OCA-EU API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/members',       memberRoutes);
app.use('/api/executives',    executiveRoutes);
app.use('/api/chapters',      chapterRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/chapters',      chapterRoutes);
// app.use('/api/messages',      messageRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin',         adminRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler (must be registered last) ────────────────────────────
app.use(errorHandler);

export default app;
