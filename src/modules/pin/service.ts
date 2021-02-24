import { sendPin } from '@email';
import { Model } from 'mongoose';
import { Pin, PinDocument } from './schema';
import { VerifyPinDto } from './dto/verify';
import { CreatePinDto } from './dto/create';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@modules/user/schema';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * Pin service
 */
@Injectable()
export class PinService {
  /** Pin model */
  private readonly pinModel: Model<PinDocument>;
  /** User model */
  private readonly userModel: Model<UserDocument>;

  /**
   * Creates a new pin service
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
   * Creates pin for user.
   *
   * @param data - Create pin data
   */
  async create(data: CreatePinDto) {
    const { email } = data;
    // check if user exists
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        message: `User '${email}' does not exists`,
        statusCode: 400,
        code: 'USER_DOESNT_EXISTS'
      });
    }
    // create pin
    const pin = new this.pinModel();
    pin.email = email;
    await pin.save();
    // send pin to email
    await sendPin(email, pin.code);
  }

  /**
   * Verifies user by pin.
   *
   * @param data - Verify user data
   */
  async verify(data: VerifyPinDto) {
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
    // remove pin
    await pin.remove();
  }
}
