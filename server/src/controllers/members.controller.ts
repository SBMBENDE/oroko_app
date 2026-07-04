import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { MemberStatus, Role } from '../types/enums';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from '../services/auth.service';
import { uploadAvatar, deleteAvatar, extractPublicId } from '../services/upload.service';
import { buildMemberFilter } from '../services/search.service';
import {
  sanitizePublicProfile,
  sanitizeDirectoryCard,
} from '../utils/sanitizePublicProfile';
import { getPagination, buildPaginationMeta } from '../utils/paginate';

// ── GET /api/members — Public directory ───────────────────────────────────────
export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, country, chapter, profession, skills, languages, page, limit } =
      req.query as Record<string, string | undefined>;

    const filter = await buildMemberFilter(
      { search, country, chapter, profession, skills, languages },
      true // publicOnly: Active members only
    );

    const { skip, limit: lim, page: pg } = getPagination({ page, limit });

    const [members, total] = await Promise.all([
      User.find(filter)
        .select(
          'firstName lastName profilePhoto country chapter role executivePosition memberNumber joinedAt profession languages privacy'
        )
        .populate('chapter', 'name slug country')
        .sort({ firstName: 1, lastName: 1 })
        .skip(skip)
        .limit(lim)
        .lean({ virtuals: false }),
      User.countDocuments(filter),
    ]);

    const data = members.map((m) => sanitizeDirectoryCard(m as any));

    res.json({
      success: true,
      data,
      pagination: buildPaginationMeta(total, pg, lim),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/members/:id — Public profile ─────────────────────────────────────
export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: MemberStatus.ACTIVE,
    }).populate('chapter', 'name slug country');

    if (!user) {
      throw new AppError('Member not found', 404);
    }

    res.json({
      success: true,
      data: sanitizePublicProfile(user),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/members/me — Own full profile ────────────────────────────────────
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate('chapter', 'name slug country');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/members/me/profile — Update own profile ───────────────────────
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ALLOWED_FIELDS = [
      'firstName', 'lastName', 'country', 'chapter',
      'bio', 'profession', 'company', 'occupation',
      'phone', 'whatsapp', 'linkedin', 'facebook', 'instagram', 'website',
      'languages', 'skills', 'interests',
    ];

    // Whitelist fields to prevent mass assignment
    const updates: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('chapter', 'name slug country');

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/members/me/avatar — Upload profile photo ──────────────────────
export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.file is guaranteed by the upload middleware chain
    const buffer = req.file!.buffer;
    const userId = String(req.user!._id);

    // Delete old photo from Cloudinary if it exists
    const currentUser = await User.findById(userId).select('profilePhoto');
    if (currentUser?.profilePhoto) {
      const oldPublicId = extractPublicId(currentUser.profilePhoto);
      if (oldPublicId) await deleteAvatar(oldPublicId);
    }

    const photoUrl = await uploadAvatar(buffer, userId);

    await User.findByIdAndUpdate(userId, { profilePhoto: photoUrl });

    res.json({
      success: true,
      message: 'Profile photo updated',
      data: { profilePhoto: photoUrl },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/members/me/privacy — Update privacy settings ──────────────────
export const updatePrivacy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const PRIVACY_FIELDS = [
      'showPhone', 'showWhatsapp', 'showEmail',
      'showProfession', 'allowMessages', 'allowNetworking',
    ];

    const privacyUpdates: Record<string, boolean> = {};
    for (const field of PRIVACY_FIELDS) {
      if (req.body[field] !== undefined) {
        privacyUpdates[`privacy.${field}`] = req.body[field];
      }
    }

    if (Object.keys(privacyUpdates).length === 0) {
      throw new AppError('No privacy settings provided', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: privacyUpdates },
      { new: true }
    ).select('privacy');

    res.json({ success: true, message: 'Privacy settings updated', data: user?.privacy });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/members/me/password — Change password ─────────────────────────
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch with passwordHash to verify current password
    const user = await User.findById(req.user!._id).select('+passwordHash');
    if (!user) throw new AppError('User not found', 404);

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    const newHash = await hashPassword(newPassword);

    // Update password and invalidate all refresh tokens (force re-login everywhere)
    await User.findByIdAndUpdate(user._id, {
      passwordHash: newHash,
      $unset: { refreshTokenHash: 1 },
    });

    res.json({
      success: true,
      message: 'Password changed successfully. Please log in again on other devices.',
    });
  } catch (err) {
    next(err);
  }
};
