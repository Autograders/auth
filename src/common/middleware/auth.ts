import { verify } from 'jsonwebtoken';
import { IUser, UserModel } from '@models/user';
import { Request, Response, NextFunction } from 'express';
import { JWT_REFRESH_SECRET, JWT_SECRET, REFRESH_COOKIE } from '@constants';
import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

/**
 * Extend Express Request interface
 */
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

/**
 * Authentication middleware with claims token (bearer authorization header).
 */
@Injectable()
export class ClaimsMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: NextFunction) {
    const { authorization } = req.headers;
    // check if authorization header exists
    if (typeof authorization !== 'string' || authorization === '') throw new UnauthorizedException();
    // check access token
    let id, key;
    try {
      ({ id, key } = verify(authorization, JWT_SECRET) as any);
    } catch (error) {
      throw new UnauthorizedException();
    }
    // check user auth key
    const user = await UserModel.findById(id);
    if (!user || user.key !== key) throw new ForbiddenException();
    // attach user info
    req.user = user;
    next();
  }
}

/**
 * Authentication middleware with refresh token (HTTP only cookie).
 */
@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const refresh_token = req.cookies[REFRESH_COOKIE];
    // check if refresh exists
    if (typeof refresh_token !== 'string' || refresh_token === '') throw new UnauthorizedException();
    // check access token
    let id, key;
    try {
      ({ id, key } = verify(refresh_token, JWT_REFRESH_SECRET) as any);
    } catch (error) {
      res.clearCookie(REFRESH_COOKIE);
      throw new UnauthorizedException();
    }
    // check user auth key
    const user = await UserModel.findById(id);
    if (!user || user.key !== key) {
      res.clearCookie(REFRESH_COOKIE);
      throw new ForbiddenException();
    }
    // attach user info
    req.user = user;
    next();
  }
}
