import { UserService } from './service';
import { CreateUserDto } from './dto/create';
import { Body, Controller, Post } from '@nestjs/common';
import { VerifyUserDto } from './dto/verify';

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
  async create(@Body() data: CreateUserDto) {
    return {
      id: await this.userService.create(data),
      message: `User '${data.email}' created successfully`
    };
  }

  /**
   * Verifies user endpoint
   *
   * @param data - Verify user payload
   */
  @Post('/verify')
  async verify(@Body() data: VerifyUserDto) {
    await this.userService.verify(data);
    return {
      message: `User '${data.email}' verified successfully`
    };
  }
}
