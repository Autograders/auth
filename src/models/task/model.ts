import { getUTC } from '@utils';
import { ITask } from './interface';
import { model, Schema } from 'mongoose';

/**
 * Task model.
 */
export const TaskModel = model<ITask>(
  'Task',
  new Schema({
    name: {
      type: String,
      required: true
    },
    tries: {
      type: Number,
      required: true
    },
    files: [
      {
        type: String,
        required: true
      }
    ],
    due: {
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
