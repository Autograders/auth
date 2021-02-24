import { hash } from 'argon2';
import { sendPin } from '@email';
import { Model } from 'mongoose';
import { VerifyUserDto } from './dto/verify';
import { CreateUserDto } from './dto/create';
import { User, UserDocument } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Pin, PinDocument } from '@modules/pin/schema';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * User service
 */
@Injectable()
export class UserService {
  /** Pin model */
  private readonly pinModel: Model<PinDocument>;
  /** User model */
  private readonly userModel: Model<UserDocument>;

  /**
   * Creates a new user service
   *
   * @param pinModel  - Pin model
   * @param userModel - User model
   */
  constructor(
    @InjectModel(Pin.name) pinModel: Model<PinDocument>,
    @InjectModel(User.name) userModel: Model<UserDocument>
  ) {
    this.pinModel = pinModel;
    this.userModel = userModel;
  }

  /**
   * Creates user.
   *
   * @param data - Create user payload
   */
  async create(data: CreateUserDto) {
    const { fullName, email, password } = data;
    // check if user already exists
    if (await this.userModel.exists({ email })) {
      throw new BadRequestException({
        message: `User '${email}' already exists`,
        statusCode: 400,
        code: 'USER_ALREADY_EXISTS'
      });
    }
    // hash password
    const hashedPassword = await hash(password);
    // start transaction
    const session = await this.userModel.db.startSession();
    session.startTransaction();
    // create user
    const user = new this.userModel();
    user.fullName = fullName;
    user.email = email;
    user.password = hashedPassword;
    await user.save({ session });
    // create pin
    const pin = new this.pinModel();
    pin.email = email;
    await pin.save({ session });
    // commit
    await session.commitTransaction();
    // send pin to email
    await sendPin(email, pin.code);
    session.endSession();
    return user.id;
  }

  /**
   * Verifies user by pin.
   *
   * @param data - Verify user data
   */
  async verify(data: VerifyUserDto) {
    const { email, code } = data;
    // check if user exists
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        message: `User '${email}' does not exists`,
        statusCode: 400,
        code: 'USER_DOESNT_EXISTS'
      });
    }
    // check if pin exists
    const pin = await this.pinModel.findOne({ email, code });
    if (!pin) {
      throw new BadRequestException({
        message: `Invalid or expired pin '${code}'`,
        statusCode: 400,
        code: 'INVALID_PIN'
      });
    }
    // start transaction
    const session = await this.userModel.db.startSession();
    session.startTransaction();
    // update user
    user.verified = true;
    await user.save({ session });
    // remove pin
    await pin.remove({ session });
    // commit
    await session.commitTransaction();
    session.endSession();
  }
}
