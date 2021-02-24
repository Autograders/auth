import { v4 } from 'uuid';
import { getUTC } from '@utils';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * User entity.
 */
@Schema()
export class User {
  /** User full name */
  @Prop()
  fullName!: string;

  /** User email */
  @Prop({ unique: true })
  email!: string;

  /** User password */
  @Prop()
  password!: string;

  /** If user is verified */
  @Prop({ default: false })
  verified!: boolean;

  /** If user is admin */
  @Prop({ default: false })
  admin!: boolean;

  /** User session key */
  @Prop({ default: v4 })
  key!: string;

  /** User created at */
  @Prop({ default: getUTC })
  createdAt!: Date;

  /** User updated at */
  @Prop({ default: getUTC })
  updatedAt!: Date;
}

/**
 * User document.
 */
export type UserDocument = User & Document;

/**
 * User schema.
 */
export const UserSchema = SchemaFactory.createForClass(User);
