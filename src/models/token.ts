import mongoose from 'mongoose';

/**
 * Token interface.
 */
export interface IToken extends mongoose.Document {
  /** User email */
  email: string;
  /** User refresh token */
  token: string;
}

/**
 * Token model.
 */
export const Token = mongoose.model<IToken>(
  'Token',
  new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  })
);
