import { Router } from 'express';
import {
  register,
  verifyEmail,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';

const router = Router();

// Public routes
router.post('/register',         registerLimiter, validate(registerSchema),        register);
router.post('/verify-email',                      validate(verifyEmailSchema),       verifyEmail);
router.post('/login',            authLimiter,     validate(loginSchema),            login);
router.post('/refresh',                                                              refresh);
router.post('/forgot-password',  authLimiter,     validate(forgotPasswordSchema),   forgotPassword);
router.post('/reset-password',                    validate(resetPasswordSchema),     resetPassword);

// Protected route (requires valid access token)
router.post('/logout', authenticate, logout);

export default router;
