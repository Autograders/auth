import { BadRequestException } from '@nestjs/common';

/**
 * User does not exists error.
 */
export class UserDoesNotExists extends BadRequestException {
  /**
   * Creates a new user does not exists exception.
   *
   * @param user - User identifier
   */
  constructor(user: string) {
    super({
      message: `User '${user}' does not exists`,
      status: 400,
      faultcode: 'USER_DOES_NOT_EXISTS'
    });
  }
}
