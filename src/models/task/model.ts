import { getUTC } from '@utils';
import { ITask } from './interface';
import { model, Schema } from 'mongoose';

/**
 * Task model.
 */
export const Task = model<ITask>(
  'Task',
  new Schema({
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
    dueDate: {
      type: Date,
      required: true
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
