import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Role, MemberStatus } from '../types/enums';

// ── GET /api/executives — Auto-generated from role ───────────────────────────
export const getExecutives = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const executives = await User.find({
      role: Role.EXECUTIVE,
      status: MemberStatus.ACTIVE,
    })
      .select(
        'firstName lastName profilePhoto country chapter role executivePosition executiveOrder joinedAt profession bio languages privacy'
      )
      .populate('chapter', 'name slug country')
      .sort({ executiveOrder: 1, firstName: 1 });

    // Apply privacy filtering to each executive profile
    const data = executives.map((exec) => ({
      _id: exec._id,
      firstName: exec.firstName,
      lastName: exec.lastName,
      profilePhoto: exec.profilePhoto ?? null,
      country: exec.country,
      chapter: exec.chapter ?? null,
      role: exec.role,
      executivePosition: exec.executivePosition ?? null,
      executiveOrder: exec.executiveOrder ?? null,
      joinedAt: exec.joinedAt ?? null,
      // Conditionally include based on privacy
      ...(exec.privacy.showProfession && { profession: exec.profession ?? null }),
      ...(exec.privacy.allowNetworking && { bio: exec.bio ?? null }),
      ...(exec.privacy.showEmail && { email: exec.email }),
      ...(exec.privacy.showWhatsapp && { whatsapp: exec.whatsapp }),
      ...(exec.privacy.showPhone && { phone: exec.phone }),
      languages: exec.languages,
      canMessage: exec.privacy.allowMessages,
      canNetwork: exec.privacy.allowNetworking,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
