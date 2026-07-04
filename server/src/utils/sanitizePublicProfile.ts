import { IUser } from '../models/User';

/**
 * Returns a sanitized public-facing user object, respecting all privacy settings.
 * Always call this before sending a user profile to an unauthenticated or
 * non-owner request.
 */
export function sanitizePublicProfile(user: IUser) {
  const base = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    country: user.country,
    profilePhoto: user.profilePhoto ?? null,
    role: user.role,
    chapter: user.chapter ?? null,
    languages: user.languages,
    interests: user.interests,
    executivePosition: user.executivePosition ?? null,
    memberNumber: user.memberNumber ?? null,
    joinedAt: user.joinedAt ?? null,
    // Surface privacy flags so the frontend knows what controls to show
    privacy: {
      allowMessages: user.privacy.allowMessages,
      allowNetworking: user.privacy.allowNetworking,
    },
  };

  return {
    ...base,
    ...(user.privacy.showEmail && { email: user.email }),
    ...(user.privacy.showPhone && { phone: user.phone }),
    ...(user.privacy.showWhatsapp && { whatsapp: user.whatsapp }),
    ...(user.privacy.showProfession && {
      profession: user.profession ?? null,
      company: user.company ?? null,
      occupation: user.occupation ?? null,
      skills: user.skills,
    }),
    ...(user.privacy.allowNetworking && {
      bio: user.bio ?? null,
      linkedin: user.linkedin ?? null,
      facebook: user.facebook ?? null,
      instagram: user.instagram ?? null,
      website: user.website ?? null,
    }),
  };
}

/**
 * Returns a minimal safe subset for the members directory grid.
 * This is used for card-level data — not full profiles.
 */
export function sanitizeDirectoryCard(user: IUser) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePhoto: user.profilePhoto ?? null,
    country: user.country,
    chapter: user.chapter ?? null,
    role: user.role,
    executivePosition: user.executivePosition ?? null,
    memberNumber: user.memberNumber ?? null,
    joinedAt: user.joinedAt ?? null,
    languages: user.languages,
    // Conditionally included based on privacy
    ...(user.privacy.showProfession && { profession: user.profession ?? null }),
    // Expose flags (not raw settings) so frontend knows which action buttons to show
    canMessage: user.privacy.allowMessages,
    canNetwork: user.privacy.allowNetworking,
  };
}

