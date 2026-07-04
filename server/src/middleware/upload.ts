import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { validateImageBuffer } from '../services/upload.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Store files in memory so we can stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new AppError('Only JPEG, PNG, and WebP images are allowed', 400));
    return;
  }
  cb(null, true);
};

const uploader = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

/** Single avatar upload — field name: "avatar" */
export const uploadAvatarMiddleware = uploader.single('avatar');

/**
 * Magic-byte validation middleware.
 * Must run AFTER uploadAvatarMiddleware has populated req.file.
 */
export const validateAvatarBuffer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    return next(new AppError('Profile photo is required', 400));
  }

  const isValid = validateImageBuffer(req.file.buffer, req.file.mimetype);
  if (!isValid) {
    return next(new AppError('Invalid image file', 400));
  }

  next();
};
