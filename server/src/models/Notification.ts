import mongoose, { Document, Schema } from 'mongoose';
import { NotificationType } from '../types/enums';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
      maxlength: 500,
    },
    read: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

notificationSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => { delete ret.__v; return ret; },
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
