import { Router } from 'express';
import {
  getConversations,
  getThread,
  sendMessage,
  markThreadRead,
  deleteMessage,
} from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth';
import { requireMember } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { messageLimiter } from '../middleware/rateLimiter';
import { sendMessageSchema, messageThreadQuerySchema } from '../schemas/message.schema';

const router = Router();

// All messaging routes require an authenticated, active member
router.use(authenticate, requireMember);

// ── Static routes first to avoid conflict with /:userId ──────────────────────
router.get('/conversations', getConversations);

// ── Thread routes ─────────────────────────────────────────────────────────────
router.get(
  '/conversations/:userId',
  validate(messageThreadQuerySchema),
  getThread
);
router.post(
  '/:userId',
  messageLimiter,
  validate(sendMessageSchema),
  sendMessage
);
router.patch('/:userId/read', markThreadRead);
router.delete('/:messageId',  deleteMessage);

export default router;
