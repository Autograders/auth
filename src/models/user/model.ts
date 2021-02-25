import { v4 } from 'uuid';
import { getUTC } from '@utils';
import { IUser } from './interface';
import { model, Schema } from 'mongoose';

/**
 * User model.
 */
export const UserModel = model<IUser>(
  'User',
  new Schema({
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
    },
    key: {
      type: String,
      default: v4
    },
    lastLoginTime: {
      type: Date,
      default: undefined
    },
    createdAt: {
      type: Date,
      default: getUTC
    },
    updatedAt: {
      type: Date,
      default: getUTC
    }
  })
);
