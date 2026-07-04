import { connectDB } from './config/db';
import app from './app';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  // Connect to MongoDB before accepting traffic
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 OCA-EU API running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = (signal: string): void => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught exception:', err);
    server.close(() => process.exit(1));
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
