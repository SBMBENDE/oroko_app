// Vercel serverless entry point — exports the Express app without calling listen()
import '../src/config/env'; // Validate env vars before anything else
import mongoose from 'mongoose';
import app from '../src/app';
import { env } from '../src/config/env';

// Connect once per cold start (Vercel reuses connections across invocations)
let connected = false;

const handler = async (req: unknown, res: unknown) => {
  if (!connected) {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      bufferCommands: false,
    });
    connected = true;
  }
  return (app as any)(req, res);
};

export default handler;
