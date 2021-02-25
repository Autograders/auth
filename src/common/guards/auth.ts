import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Admin role guard.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user.admin) return false;
    return true;
  }
}
