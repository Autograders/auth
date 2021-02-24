import { getUTC } from '@utils';
import { Document } from 'mongoose';
import { generatePin } from '@utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Pin entity.
 */
@Schema()
export class Pin {
  /** User reference */
  @Prop({ required: true })
  email!: string;

  /** Pin code */
  @Prop({ default: generatePin })
  code!: string;

  /** User created at */
  @Prop({ default: getUTC })
  createdAt!: Date;
}

/**
 * Pin document.
 */
export type PinDocument = Pin & Document;

/**
 * Pin schema.
 */
export const PinSchema = SchemaFactory.createForClass(Pin);
