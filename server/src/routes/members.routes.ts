import { Router } from 'express';
import {
  getMembers,
  getMemberById,
  getMe,
  updateMe,
  updateAvatar,
  updatePrivacy,
  changePassword,
} from '../controllers/members.controller';
import { authenticate } from '../middleware/auth';
import { requireMember } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { uploadAvatarMiddleware, validateAvatarBuffer } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimiter';
import {
  memberQuerySchema,
  updateProfileSchema,
  updatePrivacySchema,
  changePasswordSchema,
} from '../schemas/member.schema';

const router = Router();

// ── Protected /me routes MUST come before /:id ────────────────────────────────
router.get('/me',          authenticate, requireMember, getMe);
router.patch('/me/profile', authenticate, requireMember, validate(updateProfileSchema), updateMe);
router.patch(
  '/me/avatar',
  authenticate,
  requireMember,
  uploadLimiter,
  uploadAvatarMiddleware,
  validateAvatarBuffer,
  updateAvatar
);
router.patch('/me/privacy',  authenticate, requireMember, validate(updatePrivacySchema),  updatePrivacy);
router.patch('/me/password', authenticate, requireMember, validate(changePasswordSchema), changePassword);

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',    validate(memberQuerySchema), getMembers);
router.get('/:id', getMemberById);

export default router;
