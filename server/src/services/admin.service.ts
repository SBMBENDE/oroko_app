import { AuditLog } from '../models/AuditLog';
import { AuditAction } from '../types/enums';

/**
 * Write an immutable audit log entry.
 * Never throws — a failed audit log write should never block the admin action.
 */
export async function logAudit(
  adminId: string,
  action: AuditAction,
  targetUserId: string,
  ip: string,
  before?: Record<string, unknown>,
  after?: Record<string, unknown>
): Promise<void> {
  try {
    await AuditLog.create({ admin: adminId, action, targetUser: targetUserId, before, after, ip });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

/** Extract a safe snapshot of a user document for audit before/after fields */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function userSnapshot(user: any): Record<string, unknown> {
  const { passwordHash, refreshTokenHash, emailVerifyToken,
          passwordResetToken, passwordResetExpiry, ...safe } = user as Record<string, unknown>;
  void passwordHash; void refreshTokenHash; void emailVerifyToken;
  void passwordResetToken; void passwordResetExpiry;
  return safe;
}
