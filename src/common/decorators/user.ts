import { Request } from 'express';
import { IUser } from '@models/user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User parameter decorator.
 */
export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Request;
  return req.body.user as IUser;
});
