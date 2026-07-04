import mongoose, { Document, Schema } from 'mongoose';

export interface IChapter extends Document {
  name: string;
  slug: string;
  country: string;
  description?: string;
  chapterAdmin?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
  {
    name: {
      type: String,
      required: [true, 'Chapter name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Chapter slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    chapterAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chapterSchema.index({ country: 1 });
chapterSchema.index({ isActive: 1 });

chapterSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => { delete ret.__v; return ret; },
});

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
