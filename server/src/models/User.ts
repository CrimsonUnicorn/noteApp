import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date;
  passwordHash?: string;
  googleId?: string;
  emailVerified: boolean;
  otpHash?: string | null;
  otpExpires?: Date | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  dob: { type: Date },
  passwordHash: String,
  googleId: String,
  emailVerified: { type: Boolean, default: false },
  otpHash: String,
  otpExpires: Date
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
