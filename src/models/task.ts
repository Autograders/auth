import mongoose from 'mongoose';

/**
 * Task interface.
 */
export interface ITask extends mongoose.Document {
  /** Task id */
  taskId: string;
  /** Task name */
  taskName: string;
  /** Task max tries */
  maxTries: number;
  /** Task files */
  files: string[];
  /** Task created at */
  createdAt: Date;
  /** Task updated at */
  updatedAt: Date;
}

/**
 * Task model.
 */
export const Task = mongoose.model<ITask>(
  'Task',
  new mongoose.Schema({
    taskId: {
      type: String,
      required: true,
      unique: true
    },
    taskName: {
      type: String,
      required: true
    },
    maxTries: {
      type: Number,
      required: true
    },
    files: [
      {
        type: String,
        required: true
      }
    ],
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    updatedAt: {
      type: Date,
      default: () => new Date()
    }
  })
);
