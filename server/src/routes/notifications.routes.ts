import { Router } from 'express';
import {
  getNotifications,
  markAllRead,
  markOneRead,
  deleteNotification,
} from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth';
import { requireMember } from '../middleware/authorize';

const router = Router();

router.use(authenticate, requireMember);

// Static route MUST come before /:id/read
router.get('/',            getNotifications);
router.patch('/read-all',  markAllRead);
router.patch('/:id/read',  markOneRead);
router.delete('/:id',      deleteNotification);

export default router;
