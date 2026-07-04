import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    read: { type: Boolean, default: false },
    deletedBySender: { type: Boolean, default: false },
    deletedByRecipient: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for loading a conversation thread efficiently
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
// Index for unread count queries
messageSchema.index({ recipient: 1, read: 1 });

messageSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => { delete ret.__v; return ret; },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
