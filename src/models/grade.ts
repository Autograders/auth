import mongoose from 'mongoose';

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
 * Grade interface.
 */
export interface IGrade extends mongoose.Document {
  /** User identifier */
  userId: string;
  /** Task identifier */
  taskId: string;
  /** If submit is already queued */
  queued: boolean;
  /** Submit grade */
  grade: number;
  /** Submit details */
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

/**
 * Grade model.
 */
export const Grade = mongoose.model<IGrade>(
  'Grade',
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
      default: () => new Date()
    },
    updatedAt: {
      type: Date,
      default: () => new Date()
    }
  })
);
