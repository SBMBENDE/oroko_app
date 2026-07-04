import { Request, Response, NextFunction } from 'express';
import { Chapter } from '../models/Chapter';
import { AppError } from '../middleware/errorHandler';
import { getPagination, buildPaginationMeta } from '../utils/paginate';

// ── GET /api/chapters ─────────────────────────────────────────────────────────
export const getChapters = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapters = await Chapter.find({ isActive: true })
      .populate('chapterAdmin', 'firstName lastName email')
      .sort({ name: 1 });

    res.json({ success: true, data: chapters });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/chapters/:id ─────────────────────────────────────────────────────
export const getChapterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('chapterAdmin', 'firstName lastName email');

    if (!chapter) throw new AppError('Chapter not found', 404);

    res.json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/chapters ────────────────────────────────────────────────────────
export const createChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, slug, country, description, chapterAdmin } = req.body;
    const chapter = await Chapter.create({
      name, slug, country,
      description: description || undefined,
      chapterAdmin: chapterAdmin || undefined,
    });

    res.status(201).json({ success: true, message: 'Chapter created', data: chapter });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/chapters/:id ───────────────────────────────────────────────────
export const updateChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ALLOWED = ['name', 'country', 'description', 'chapterAdmin'];
    const updates: Record<string, unknown> = {};
    for (const f of ALLOWED) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );

    if (!chapter) throw new AppError('Chapter not found', 404);

    res.json({ success: true, message: 'Chapter updated', data: chapter });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/chapters/:id — Soft delete (SUPER_ADMIN only) ─────────────────
export const deleteChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );

    if (!chapter) throw new AppError('Chapter not found', 404);

    res.json({ success: true, message: `Chapter "${chapter.name}" deactivated` });
  } catch (err) {
    next(err);
  }
};
