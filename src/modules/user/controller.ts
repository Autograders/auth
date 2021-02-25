import { UserService } from './service';
import { CreateUserDto } from './dto/create';
import { VerifyUserDto } from './dto/verify';
import { Body, Controller, Post } from '@nestjs/common';

/**
 * User controller.
 */
@Controller('user')
export class UserController {
  /** User service */
  private readonly userService!: UserService;

  /**
   * Creates a new user controller.
   *
   * @param userService - User service
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Create user endpoint
   *
   * @param data - Create user payload
   */
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  /**
   * Verifies user endpoint
   *
   * @param data - Verify user payload
   */
  @Post('/verify')
  verify(@Body() data: VerifyUserDto) {
    return this.userService.verify(data);
  }
}
