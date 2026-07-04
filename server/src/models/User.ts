import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Role, MemberStatus } from '../types/enums';

export interface IUser extends Document {
  // Auth
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerifyToken?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  refreshTokenHash?: string;

  // Role & Status
  role: Role;
  status: MemberStatus;

  // Required profile
  firstName: string;
  lastName: string;
  country: string;
  chapter?: mongoose.Types.ObjectId;
  profilePhoto?: string;

  // Optional profile
  bio?: string;
  profession?: string;
  company?: string;
  occupation?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  languages: string[];
  skills: string[];
  interests: string[];

  // Executive (only relevant when role = EXECUTIVE)
  executivePosition?: string;
  executiveOrder?: number;

  // Privacy settings
  privacy: {
    showPhone: boolean;
    showWhatsapp: boolean;
    showEmail: boolean;
    showProfession: boolean;
    allowMessages: boolean;
    allowNetworking: boolean;
  };

  // Membership metadata
  memberNumber?: string;
  joinedAt?: Date;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  suspendedAt?: Date;
  suspendedBy?: mongoose.Types.ObjectId;
  suspendReason?: string;

  // Notification preferences
  emailOnMessage: boolean;
  emailOnApproval: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getFullName(): string;
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
  {
    // ── Auth ─────────────────────────────────────────────────────────────────
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },

    // ── Role & Status ─────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.PENDING_MEMBER,
    },
    status: {
      type: String,
      enum: Object.values(MemberStatus),
      default: MemberStatus.PENDING,
    },

    // ── Required profile ──────────────────────────────────────────────────────
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    profilePhoto: { type: String },

    // ── Optional profile ──────────────────────────────────────────────────────
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      trim: true,
    },
    profession: { type: String, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    occupation: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    website: { type: String, trim: true },
    languages: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],

    // ── Executive ─────────────────────────────────────────────────────────────
    executivePosition: { type: String, trim: true },
    executiveOrder: { type: Number },

    // ── Privacy settings ──────────────────────────────────────────────────────
    privacy: {
      showPhone: { type: Boolean, default: false },
      showWhatsapp: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showProfession: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
      allowNetworking: { type: Boolean, default: true },
    },

    // ── Membership metadata ───────────────────────────────────────────────────
    memberNumber: { type: String, unique: true, sparse: true },
    joinedAt: { type: Date },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    suspendedAt: { type: Date },
    suspendedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    suspendReason: { type: String },

    // ── Notification preferences ──────────────────────────────────────────────
    emailOnMessage: { type: Boolean, default: true },
    emailOnApproval: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ chapter: 1 });
userSchema.index({ country: 1 });
userSchema.index({ 'executive.isExecutive': 1 });
// Full-text index for the member search feature
userSchema.index(
  {
    firstName: 'text',
    lastName: 'text',
    profession: 'text',
    bio: 'text',
    skills: 'text',
    languages: 'text',
  },
  { name: 'member_text_search', weights: { firstName: 10, lastName: 10, profession: 5 } }
);

// ── Instance methods ──────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

// ── Static methods ────────────────────────────────────────────────────────────
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+passwordHash');
};

// ── toJSON transform — strip sensitive fields ─────────────────────────────────
userSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    delete ret.passwordHash;
    delete ret.emailVerifyToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpiry;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
