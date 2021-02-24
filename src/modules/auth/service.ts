import { v4 } from 'uuid';
import { getUTC } from '@utils';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { SignInDto } from './dto/signin';
import { IUser, UserModel } from '@models/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_TIME, JWT_REFRESH_SECRET, JWT_SECRET, REFRESH_TOKEN_TIME } from '@constants';

/**
 * Auth service
 */
@Injectable()
export class AuthService {
  /**
   * Signs in a user.
   *
   * @param data - Sign in dat
   */
  async signIn(data: SignInDto) {
    const { email, password } = data;
    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        message: `User '${email}' does not exists`,
        statusCode: 400,
        code: 'USER_DOESNT_EXISTS'
      });
    }
    // check if user is verified
    if (!user.verified) {
      throw new BadRequestException({
        message: `User '${email}' is not verified`,
        statusCode: 400,
        code: 'USER_NOT_VERIFIED'
      });
    }
    // check user password
    if (!(await verify(user.password, password))) {
      throw new BadRequestException({
        message: 'Invalid log in credentials',
        statusCode: 400,
        code: 'INVALID_CREDENTIALS'
      });
    }
    // unpack user info
    const { id, fullName, admin, key, lastLoginTime, createdAt } = user;
    // set last login
    user.lastLoginTime = getUTC();
    await user.save();
    return {
      user_attributes: { id, fullName, email, admin, lastLoginTime, createdAt },
      access_token: sign({ id, email, key }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME }),
      refresh_token: sign({ id, email, key }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TIME })
    };
  }

  /**
   * Generates a new access and refresh tokens.
   *
   * @param user - User entity
   */
  async refresh(user: IUser) {
    const { id, email, key } = user;
    return {
      access_token: sign({ id, email, key }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME }),
      refresh_token: sign({ id, email, key }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TIME })
    };
  }

  /**
   * Signs out a user.
   *
   * @param allDevices - Sign out from all devices
   * @param user       - User entity
   */
  async signOut(allDevices: boolean, user: IUser) {
    if (allDevices) {
      user.key = v4();
      user.updatedAt = getUTC();
      await user.save();
    }
  }
}
