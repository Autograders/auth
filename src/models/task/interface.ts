import { Document } from 'mongoose';

/**
 * Task entity.
 */
export interface ITask extends Document {
  /** Task id */
  taskId: string;

  /** Task name */
  taskName: string;

  /** Task max tries */
  maxTries: number;

  /** Task files */
  files: string[];

  /** Task due date */
  dueDate: Date;

  /** Task created at */
  createdAt: Date;

  /** Task updated at */
  updatedAt: Date;
}
