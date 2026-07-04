import { Router } from 'express';
import { getExecutives } from '../controllers/executives.controller';

const router = Router();

// Public — no auth required
router.get('/', getExecutives);

export default router;
