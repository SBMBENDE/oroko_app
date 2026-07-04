import { z } from 'zod';

const optionalUrl = z.string().url('Must be a valid URL').optional().or(z.literal(''));

export const updateProfileSchema = z.object({
  body: z.object({
    firstName:  z.string().min(1).max(50).trim().optional(),
    lastName:   z.string().min(1).max(50).trim().optional(),
    country:    z.string().min(1).trim().optional(),
    chapter:    z.string().optional(),
    bio:        z.string().max(1000).trim().optional(),
    profession: z.string().max(100).trim().optional(),
    company:    z.string().max(100).trim().optional(),
    occupation: z.string().max(100).trim().optional(),
    phone:      z.string().trim().optional(),
    whatsapp:   z.string().trim().optional(),
    linkedin:   optionalUrl,
    facebook:   optionalUrl,
    instagram:  optionalUrl,
    website:    optionalUrl,
    languages:  z.array(z.string().trim()).max(20).optional(),
    skills:     z.array(z.string().trim()).max(30).optional(),
    interests:  z.array(z.string().trim()).max(20).optional(),
  }),
});

export const updatePrivacySchema = z.object({
  body: z.object({
    showPhone:       z.boolean().optional(),
    showWhatsapp:    z.boolean().optional(),
    showEmail:       z.boolean().optional(),
    showProfession:  z.boolean().optional(),
    allowMessages:   z.boolean().optional(),
    allowNetworking: z.boolean().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
  }),
});

export const memberQuerySchema = z.object({
  query: z.object({
    search:     z.string().max(100).optional(),
    country:    z.string().max(100).optional(),
    chapter:    z.string().optional(),
    profession: z.string().max(100).optional(),
    skills:     z.string().max(200).optional(),
    languages:  z.string().max(200).optional(),
    page:       z.string().regex(/^\d+$/).optional(),
    limit:      z.string().regex(/^\d+$/).optional(),
  }),
});
