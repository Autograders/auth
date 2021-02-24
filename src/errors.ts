import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';

/**
 * Internal server error.
 */
export class InternalServerError extends InternalServerErrorException {
  /**
   * Creates a new internal server error exception.
   */
  constructor() {
    super({
      message: 'Internal server error, try again',
      status: 500,
      faultcode: 'INTERNAL_SERVER_ERROR'
    });
  }
}

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

/**
 * Invalid pin error.
 */
export class InvalidPin extends BadRequestException {
  /**
   * Creates a new invalid pin exception.
   *
   * @param code - Pin code
   */
  constructor(code: string) {
    super({
      message: `Invalid or expired pin '${code}'`,
      status: 400,
      faultcode: 'INVALID_PIN'
    });
  }
}

/**
 * Unauthorized error.
 */
export class Unauthorized extends UnauthorizedException {
  /**
   * Creates a new unauthenticated exception.
   */
  constructor() {
    super({
      message: 'Unauthorized',
      status: 401,
      faultcode: 'USER_NOT_AUTHENTICATED'
    });
  }
}

/**
 * Forbidden error.
 */
export class Forbidden extends ForbiddenException {
  /**
   * Creates a new forbidden exception.
   */
  constructor() {
    super({
      message: 'Forbidden',
      status: 403,
      faultcode: 'USER_WITHOUT_PERMISSIONS'
    });
  }
}
