import mongoose from 'mongoose';

/**
 * User interface.
 */
export interface IUser extends mongoose.Document {
  /** User full name */
  fullName: string;
  /** User email */
  email: string;
  /** User password */
  password: string;
  /** User is verified */
  verified: boolean;
  /** User is admin */
  admin: boolean;
}

/**
 * User model.
 */
export const User = mongoose.model<IUser>(
  'User',
  new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  })
);
