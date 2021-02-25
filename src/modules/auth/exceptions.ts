import { BadRequestException } from '@nestjs/common';

/**
 * User is not verified error.
 */
export class UserNotVerified extends BadRequestException {
  /**
   * Creates a new user is not verified exception.
   *
   * @param user - User identifier
   */
  constructor(user: string) {
    super({
      message: `User '${user}' is not verified`,
      status: 400,
      faultCode: 'USER_NOT_VERIFIED'
    });
  }
}

/**
 * Invalid credentials error.
 */
export class InvalidCredentials extends BadRequestException {
  /**
   * Creates a new invalid credentials exception.
   */
  constructor() {
    super({
      message: 'Invalid log in credentials',
      status: 400,
      faultCode: 'INVALID_CREDENTIALS'
    });
  }
}
