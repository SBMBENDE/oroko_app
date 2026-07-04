import { z } from 'zod';
import { Role, MemberStatus } from '../types/enums';

export const adminMemberQuerySchema = z.object({
  query: z.object({
    search:   z.string().max(100).optional(),
    status:   z.nativeEnum(MemberStatus).optional(),
    role:     z.nativeEnum(Role).optional(),
    chapter:  z.string().optional(),
    country:  z.string().max(100).optional(),
    page:     z.string().regex(/^\d+$/).optional(),
    limit:    z.string().regex(/^\d+$/).optional(),
  }),
});

export const createMemberSchema = z.object({
  body: z.object({
    firstName:  z.string().min(1).max(50).trim(),
    lastName:   z.string().min(1).max(50).trim(),
    email:      z.string().email().toLowerCase(),
    password:   z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    country:    z.string().min(1).trim(),
    chapter:    z.string().optional(),
    role:       z.nativeEnum(Role).optional(),
    profession: z.string().max(100).trim().optional(),
  }),
});

export const rejectSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Rejection reason is required').max(500),
  }),
});

export const suspendSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Suspension reason is required').max(500),
  }),
});

export const assignRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role),
  }),
});

export const assignChapterSchema = z.object({
  body: z.object({
    chapter: z.string().min(1, 'Chapter ID is required'),
  }),
});

export const assignExecutiveSchema = z.object({
  body: z.object({
    executivePosition: z.string().min(1).max(100).trim().nullable(),
    executiveOrder:    z.number().int().min(1).optional(),
  }),
});

export const updateAdminMemberSchema = z.object({
  body: z.object({
    firstName:  z.string().min(1).max(50).trim().optional(),
    lastName:   z.string().min(1).max(50).trim().optional(),
    country:    z.string().min(1).trim().optional(),
    bio:        z.string().max(1000).trim().optional(),
    profession: z.string().max(100).trim().optional(),
    company:    z.string().max(100).trim().optional(),
    occupation: z.string().max(100).trim().optional(),
    languages:  z.array(z.string()).optional(),
    skills:     z.array(z.string()).optional(),
    interests:  z.array(z.string()).optional(),
  }),
});

export const chapterSchema = z.object({
  body: z.object({
    name:         z.string().min(1).max(100).trim(),
    slug:         z.string().min(1).max(50).toLowerCase().trim().regex(/^[a-z0-9-]+$/),
    country:      z.string().min(1).trim(),
    description:  z.string().max(500).trim().optional(),
    chapterAdmin: z.string().optional(),
  }),
});

export const auditLogQuerySchema = z.object({
  query: z.object({
    action:     z.string().optional(),
    targetUser: z.string().optional(),
    page:       z.string().regex(/^\d+$/).optional(),
    limit:      z.string().regex(/^\d+$/).optional(),
  }),
});
