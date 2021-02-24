import { Forbidden } from '@errors';
import { IUser } from '@models/user';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.body.user as IUser;
    if (!user.admin) throw new Forbidden();
    return true;
  }
}
