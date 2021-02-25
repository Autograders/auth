import { Forbidden } from '@common/exceptions';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Admin role guard.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user.admin) throw new Forbidden();
    return true;
  }
}
