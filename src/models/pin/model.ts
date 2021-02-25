import { IPin } from './interface';
import { model, Schema } from 'mongoose';
import { generatePin, getUTC } from '@utils';

/**
 * Pin model.
 */
export const PinModel = model<IPin>(
  'Pin',
  new Schema({
    email: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: generatePin
    },
    createdAt: {
      type: Date,
      default: getUTC
    }
  })
);
