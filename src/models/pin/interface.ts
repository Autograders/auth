import { Document } from 'mongoose';

/**
 * Pin entity.
 */
export interface IPin extends Document {
  /** User email */
  email: string;

  /** Pin code */
  code: string;

  /** Pin created at */
  createdAt: Date;
}
