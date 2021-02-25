import { hash } from 'argon2';
import { sendPin } from '@email';
import { PinModel } from '@models/pin';
import { startSession } from 'mongoose';
import { UserModel } from '@models/user';
import { VerifyUserDto } from './dto/verify';
import { CreateUserDto } from './dto/create';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * User service
 */
@Injectable()
export class UserService {
  /**
   * Creates user.
   *
   * @param data - Create user data
   */
  async create(data: CreateUserDto) {
    const { fullName, email, password } = data;
    // check if user already exists
    if (await UserModel.exists({ email })) throw new BadRequestException(`User '${email}' already exists`);
    // hash password
    const hashedPassword = await hash(password);
    // start transaction
    const session = await startSession();
    session.startTransaction();
    // create user
    const user = new UserModel();
    user.fullName = fullName;
    user.email = email;
    user.password = hashedPassword;
    await user.save({ session });
    // create pin
    const pin = new PinModel();
    pin.email = email;
    await pin.save({ session });
    // commit
    await session.commitTransaction();
    // send pin to email
    await sendPin(email, pin.code);
    session.endSession();
    return { id: user.id, message: `User '${email}' created successfully` };
  }

  /**
   * Verifies user by pin.
   *
   * @param data - Verify user data
   */
  async verify(data: VerifyUserDto) {
    const { email, code } = data;
    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new BadRequestException(`User '${email}' does not exists`);
    // check if pin exists
    const pin = await PinModel.findOne({ email, code });
    if (!pin) throw new BadRequestException(`Invalid or expired pin '${code}'`);
    // start transaction
    const session = await startSession();
    session.startTransaction();
    // update user
    user.verified = true;
    await user.save({ session });
    // remove pin
    await pin.remove({ session });
    // commit
    await session.commitTransaction();
    session.endSession();
    return { message: `User '${email}' verified successfully` };
  }
}
