import { Document } from 'mongoose';
import { IUser } from '@models/user';
import { ITask } from '@models/task';

/**
 * Grade detail interface.
 */
export interface GradeDetail {
  /** Detail name */
  name: string;
  /** Detail grade */
  grade: number;
  /** Detail message */
  message: string;
}

/**
 * Submit entity.
 */
export interface ISubmit extends Document {
  /** Grade owner */
  user: IUser;
  /** Task */
  task: ITask;
  /** If submit is queued */
  queued: boolean;
  /** Submit total grade */
  grade: number;
  /** Submit grade details */
  details: GradeDetail[];
  /** Submit stdout */
  stdout: string;
  /** Submit stderr */
  stderr: string;
  /** Submit created at */
  createdAt: Date;
  /** Submit updated at */
  updatedAt: Date;
}
