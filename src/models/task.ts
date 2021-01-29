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
    }
  })
);
