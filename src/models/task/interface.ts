import { Document } from 'mongoose';

/**
 * Task entity.
 */
export interface ITask extends Document {
  /** Task name */
  name: string;

  /** Task max tries */
  tries: number;

  /** Task files */
  files: string[];

  /** Task due date */
  due: Date;

  /** Task created at */
  createdAt: Date;

  /** Task updated at */
  updatedAt: Date;
}
