import { sendPin } from '@email';
import { PinModel } from '@models/pin';
import { UserModel } from '@models/user';
import { VerifyPinDto } from './dto/verify';
import { CreatePinDto } from './dto/create';
import { Injectable } from '@nestjs/common';
import { InvalidPin, UserDoesNotExists } from '@errors';

/**
 * Pin service
 */
@Injectable()
export class PinService {
  /**
   * Creates pin for user.
   *
   * @param data - Create pin data
   */
  async create(data: CreatePinDto) {
    const { email } = data;
    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new UserDoesNotExists(email);
    // create pin
    const pin = new PinModel();
    pin.email = email;
    await pin.save();
    // send pin to email
    await sendPin(email, pin.code);
    return { message: `Pin successfully sent to '${email}'` };
  }

  /**
   * Verifies user by pin.
   *
   * @param data - Verify user data
   */
  async verify(data: VerifyPinDto) {
    const { email, code } = data;
    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new UserDoesNotExists(email);
    // check if pin exists
    const pin = await PinModel.findOne({ email, code });
    if (!pin) throw new InvalidPin(code);
    // remove pin
    await pin.remove();
    return { message: `Pin '${code}' for '${email}' verified successfully` };
  }
}
