import mongoose from 'mongoose';

/**
 * Submit details interface.
 */
export interface SubmitDetail {
  /** Detail name */
  name: string;
  /** Detail grade */
  grade: number;
}

/**
 * Submit interface.
 */
export interface ISubmit extends mongoose.Document {
  /** User identifier */
  userId: string;
  /** Task identifier */
  taskId: string;
  /** If submit is already queued */
  queued: boolean;
  /** If submit is ready to be evaluated */
  ready: boolean;
  /** Submit grade */
  grade: number;
  /** Submit details */
  details: SubmitDetail[];
  /** Submit stdout */
  stdout: string;
  /** Submit stderr */
  stderr: string;
}

/**
 * Submit model.
 */
export const Submit = mongoose.model<ISubmit>(
  'Submit',
  new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      required: true
    },
    queued: {
      type: Boolean,
      default: true
    },
    ready: {
      type: Boolean,
      default: false
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
    }
  })
);
