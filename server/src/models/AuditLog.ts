import mongoose, { Document, Schema } from 'mongoose';
import { AuditAction } from '../types/enums';

export interface IAuditLog extends Document {
  admin: mongoose.Types.ObjectId;
  action: AuditAction;
  targetUser: mongoose.Types.ObjectId;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin is required'],
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: [true, 'Action is required'],
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target user is required'],
    },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    ip: { type: String, required: true },
  },
  {
    // AuditLogs are immutable — no updatedAt needed
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ targetUser: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });

auditLogSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => { delete ret.__v; return ret; },
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
