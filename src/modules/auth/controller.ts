import { Response } from 'express';
import { IUser } from '@models/user';
import { AuthService } from './service';
import { SignInDto } from './dto/signin';
import { User } from '@common/decorators';
import { SignOutDto } from './dto/signout';
import { IS_PROD, REFRESH_COOKIE } from '@constants';
import { Body, Controller, Post, Res } from '@nestjs/common';

/**
 * Auth controller.
 */
@Controller('auth')
export class AuthController {
  /** Auth service */
  private readonly authService!: AuthService;

  /**
   * Creates a new auth controller.
   *
   * @param authService - Auth service
   */
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Sign in endpoint.
   *
   * @param data - Sign in payload
   * @param res  - Response controller
   */
  @Post('/signin')
  async signIn(@Body() data: SignInDto, @Res({ passthrough: true }) res: Response) {
    const signInData = await this.authService.signIn(data);
    res.cookie(REFRESH_COOKIE, signInData.refresh_token, { httpOnly: true, sameSite: IS_PROD, secure: IS_PROD });
    return {
      message: `User '${data.email}' signed in successfully`,
      user_attributes: signInData.user_attributes,
      access_token: signInData.access_token
    };
  }

  /**
   * Refresh tokens endpoint.
   *
   * @param user - User entity
   * @param res  - Response controller
   */
  @Post('/refresh')
  async refresh(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refresh(user);
    res.cookie(REFRESH_COOKIE, tokens.refresh_token, { httpOnly: true, sameSite: IS_PROD, secure: IS_PROD });
    return {
      access_token: tokens.access_token
    };
  }

  /**
   * Sign out endpoint.
   *
   * @param allDevices - Sign out from all devices flag
   * @param user       - User entity
   * @param res        - Response controller
   */
  @Post('/signout')
  async signOut(@Body() data: SignOutDto, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    await this.authService.signOut(data, user);
    res.clearCookie(REFRESH_COOKIE);
    return { message: 'Sign out successfully' };
  }
}
