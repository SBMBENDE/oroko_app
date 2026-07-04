import { cloudinary } from '../config/cloudinary';
import { AppError } from '../middleware/errorHandler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validate file buffer magic bytes to prevent MIME type spoofing.
 * Returns true if the buffer matches a known image signature.
 */
export function validateImageBuffer(buffer: Buffer, mimetype: string): boolean {
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 &&
    buffer[2] === 0x4e && buffer[3] === 0x47
  ) return true;
  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 &&
    buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 &&
    buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;

  return false;
}

/**
 * Upload an image buffer to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadAvatar(
  buffer: Buffer,
  userId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'oca-eu/avatars',
        public_id: `user_${userId}`,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new AppError('Upload failed', 500));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete an avatar from Cloudinary by its public_id.
 * Fails silently — a failed delete should never block the user.
 */
export async function deleteAvatar(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete avatar from Cloudinary:', err);
  }
}

/** Extract Cloudinary public_id from a full URL */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
