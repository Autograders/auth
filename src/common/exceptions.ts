import { ValidationError } from 'class-validator';

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

/**
 * Invalid payload error.
 */
export class InvalidPayload extends BadRequestException {
  /**
   * Creates a new invalid payload exception.
   *
   * @param property    - Property name
   * @param constraints - Property contraints
   */
  constructor(errors: ValidationError[]) {
    super({
      message: 'Invalid payload',
      status: 400,
      faultcode: 'INVALID_PAYLOAD',
      details: errors.map((error) => ({
        property: error.property,
        errors: Object.keys(error.constraints as any)
      }))
    });
  }
}
