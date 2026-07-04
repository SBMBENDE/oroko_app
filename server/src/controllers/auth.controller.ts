import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Role, MemberStatus } from '../types/enums';
import { AppError } from '../middleware/errorHandler';
import {
  generateTokens,
  verifyRefreshToken,
  hashPassword,
  hashToken,
  generateSecureToken,
  setAuthCookies,
  clearAuthCookies,
} from '../services/auth.service';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/email.service';

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, country, chapter } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = generateSecureToken();

    await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      country,
      chapter: chapter || undefined,
      role: Role.PENDING_MEMBER,
      status: MemberStatus.PENDING,
      emailVerified: false,
      emailVerifyToken: hashToken(verifyToken),
      joinedAt: new Date(),
    });

    // Fire-and-forget — never let email failure block registration response
    sendVerificationEmail(email, firstName, verifyToken).catch((err) =>
      console.error('Verification email failed:', err)
    );

    res.status(201).json({
      success: true,
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/verify-email ───────────────────────────────────────────────
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;
    const hashedToken = hashToken(token);

    const user = await User.findOne({ emailVerifyToken: hashedToken });
    if (!user) {
      throw new AppError('Invalid or expired verification link', 400);
    }

    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      $unset: { emailVerifyToken: 1 },
    });

    res.json({
      success: true,
      message:
        'Email verified. Your registration is now pending admin approval.',
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // findByEmail explicitly selects +passwordHash
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.emailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const statusMessages: Partial<Record<MemberStatus, string>> = {
      [MemberStatus.PENDING]: 'Your account is pending admin approval',
      [MemberStatus.REJECTED]: 'Your membership application was not approved',
      [MemberStatus.SUSPENDED]: 'Your account has been suspended',
      [MemberStatus.INACTIVE]: 'Your account is inactive. Please contact support.',
    };

    if (user.status !== MemberStatus.ACTIVE) {
      const msg = statusMessages[user.status as MemberStatus];
      throw new AppError(msg ?? 'Account not active', 403);
    }

    const tokens = generateTokens(String(user._id), user.role as Role);

    // Store hashed refresh token (use update to safely write select:false field)
    await User.findByIdAndUpdate(user._id, {
      refreshTokenHash: hashToken(tokens.refreshToken),
    });

    setAuthCookies(res, tokens);

    // Fetch fresh user object without sensitive fields for the response
    const safeUser = await User.findById(user._id).populate('chapter', 'name slug country');

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, accessToken: tokens.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshTokenHash: 1 },
      });
    }

    clearAuthCookies(res);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      throw new AppError('Refresh token required', 401);
    }

    const decoded = verifyRefreshToken(token);

    // Explicitly select refreshTokenHash (select: false field)
    const user = await User.findById(decoded.userId).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Token reuse detection: if hash doesn't match, invalidate all sessions
    if (hashToken(token) !== user.refreshTokenHash) {
      await User.findByIdAndUpdate(user._id, { $unset: { refreshTokenHash: 1 } });
      throw new AppError('Invalid refresh token — all sessions invalidated', 401);
    }

    const tokens = generateTokens(String(user._id), user.role as Role);

    await User.findByIdAndUpdate(user._id, {
      refreshTokenHash: hashToken(tokens.refreshToken),
    });

    setAuthCookies(res, tokens);

    res.json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Always return the same response to prevent email enumeration
    const genericResponse = {
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
    };

    const user = await User.findOne({ email });
    if (!user) {
      res.json(genericResponse);
      return;
    }

    const resetToken = generateSecureToken();

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashToken(resetToken),
      passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    sendPasswordResetEmail(email, user.firstName, resetToken).catch((err) =>
      console.error('Password reset email failed:', err)
    );

    res.json(genericResponse);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;
    const hashedToken = hashToken(token);

    // Find user with valid (non-expired) reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset link', 400);
    }

    const newPasswordHash = await hashPassword(password);

    // Update password and clear all auth tokens in one atomic operation
    await User.findByIdAndUpdate(user._id, {
      passwordHash: newPasswordHash,
      $unset: {
        passwordResetToken: 1,
        passwordResetExpiry: 1,
        refreshTokenHash: 1,
      },
    });

    clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};
