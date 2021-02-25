import { v4 } from 'uuid';
import { getUTC } from '@utils';
import { verify } from 'argon2';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { SignInDto } from './dto/signin';
import { SignOutDto } from './dto/signout';
import { Injectable } from '@nestjs/common';
import { IUser, UserModel } from '@models/user';
import { UserDoesNotExists } from '@modules/user/exceptions';
import { UserNotVerified, InvalidCredentials } from './exceptions';

import {
  ACCESS_TOKEN_TIME,
  IS_PROD,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  REFRESH_COOKIE,
  REFRESH_TOKEN_TIME
} from '@constants';

/**
 * Auth service
 */
@Injectable()
export class AuthService {
  /**
   * Signs in a user.
   *
   * @param data - Sign in data
   * @param res  - Response controller
   */
  async signIn(data: SignInDto, res: Response) {
    const { email, password } = data;
    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new UserDoesNotExists(email);
    // check if user is verified
    if (!user.verified) throw new UserNotVerified(email);
    // check user password
    if (!(await verify(user.password, password))) throw new InvalidCredentials();
    // unpack user info
    const { id, fullName, admin, key, lastLoginTime, createdAt } = user;
    // set last login
    user.lastLoginTime = getUTC();
    await user.save();
    // create tokens
    const access_token = sign({ id, email, key }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME });
    const refresh_token = sign({ id, email, key }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TIME });
    // set cookie
    res.cookie(REFRESH_COOKIE, refresh_token, { httpOnly: true, sameSite: IS_PROD, secure: IS_PROD });
    return {
      message: `User '${email}' signed in successfully`,
      user_attributes: { id, fullName, email, admin, lastLoginTime, createdAt },
      access_token: access_token
    };
  }

  /**
   * Generates a new access and refresh tokens.
   *
   * @param user - User entity
   * @param res  - Response controller
   */
  refresh(user: IUser, res: Response) {
    const { id, email, key } = user;
    // create tokens
    const access_token = sign({ id, email, key }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME });
    const refresh_token = sign({ id, email, key }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TIME });
    res.cookie(REFRESH_COOKIE, refresh_token, { httpOnly: true, sameSite: IS_PROD, secure: IS_PROD });
    return { access_token };
  }

  /**
   * Signs out a user.
   *
   * @param data - Sign out data.
   * @param user - User entity
   * @param res  - Response controller
   */
  async signOut(data: SignOutDto, user: IUser, res: Response) {
    if (data.allDevices) {
      user.key = v4();
      user.updatedAt = getUTC();
      await user.save();
    }
    res.clearCookie(REFRESH_COOKIE);
    return { message: 'Sign out successfully' };
  }
}
