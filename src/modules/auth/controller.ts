import { Response } from 'express';
import { IUser } from '@models/user';
import { AuthService } from './service';
import { SignInDto } from './dto/signin';
import { User } from '@common/decorators';
import { SignOutDto } from './dto/signout';
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
  signIn(@Body() data: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(data, res);
  }

  /**
   * Refresh tokens endpoint.
   *
   * @param user - User entity
   * @param res  - Response controller
   */
  @Post('/refresh')
  refresh(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(user, res);
  }

  /**
   * Sign out endpoint.
   *
   * @param allDevices - Sign out from all devices flag
   * @param user       - User entity
   * @param res        - Response controller
   */
  @Post('/signout')
  signOut(@Body() data: SignOutDto, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(data, user, res);
  }
}
