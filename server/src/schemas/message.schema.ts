import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters')
      .trim(),
  }),
  params: z.object({
    userId: z.string().min(1, 'Recipient ID is required'),
  }),
});

export const messageThreadQuerySchema = z.object({
  query: z.object({
    page:  z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
  params: z.object({
    userId: z.string().min(1),
  }),
});
