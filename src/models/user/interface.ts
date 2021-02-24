import { Document } from 'mongoose';

/**
 * User entity.
 */
export interface IUser extends Document {
  /** User full name */
  fullName: string;

  /** User email */
  email: string;

  /** User password */
  password: string;

  /** If user is verified */
  verified: boolean;

  /** If user is admin */
  admin: boolean;

  /** User session key */
  key: string;

  /** Last login time */
  lastLoginTime?: Date;

  /** User created at */
  createdAt: Date;

  /** User updated at */
  updatedAt: Date;
}
