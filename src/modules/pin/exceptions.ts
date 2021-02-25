import { BadRequestException } from '@nestjs/common';

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
