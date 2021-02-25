import { BadRequestException } from '@nestjs/common';

/**
 * Invalid task id error.
 */
export class InvalidTaskId extends BadRequestException {
  /**
   * Creates a new invalid task id exception..
   *
   * @param id - Task identifier
   */
  constructor(id: string) {
    super({
      message: `Invalid task id '${id}'`,
      status: 400,
      faultcode: 'USER_DOES_NOT_EXISTS'
    });
  }
}
