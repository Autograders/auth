import { getUTC } from '@utils';
import { ISubmit } from './interface';
import { model, Schema } from 'mongoose';

/**
 * Submit model.
 */
export const SubmitModel = model<ISubmit>(
  'Submit',
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    },
    queued: {
      type: Boolean,
      default: true
    },
    grade: {
      type: Number,
      default: 0
    },
    details: [
      {
        name: {
          type: String,
          required: true
        },
        grade: {
          type: Number,
          required: true
        },
        message: {
          type: String,
          required: true
        }
      }
    ],
    stderr: {
      type: String,
      default: ''
    },
    stdout: {
      type: String,
      default: ''
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
