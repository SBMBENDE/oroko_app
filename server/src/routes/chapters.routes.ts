import { Router } from 'express';
import {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../controllers/chapters.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireSuperAdmin } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { chapterSchema } from '../schemas/admin.schema';

const router = Router();

// Public
router.get('/',    getChapters);
router.get('/:id', getChapterById);

// Protected
router.post('/',    authenticate, requireAdmin,      validate(chapterSchema), createChapter);
router.patch('/:id', authenticate, requireAdmin,     updateChapter);
router.delete('/:id', authenticate, requireSuperAdmin, deleteChapter);

export default router;
