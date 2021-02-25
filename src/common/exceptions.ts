import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

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
      statusCode: 400,
      faultcode: 'INVALID_PAYLOAD',
      errors: errors.map((error) => ({
        property: error.property,
        errors: Object.keys(error.constraints as any)
      }))
    });
  }
}
