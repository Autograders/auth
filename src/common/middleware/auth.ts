import { verify } from 'jsonwebtoken';
import { UserModel } from '@models/user';
import { validateTokenStructure } from '@utils';
import { Forbidden, Unauthorized } from '@errors';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JWT_REFRESH_SECRET, JWT_SECRET, REFRESH_COOKIE } from '@constants';

/**
 * Authentication middleware with claims token (bearer authorization header).
 */
@Injectable()
export class ClaimsMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: NextFunction) {
    const { authorization } = req.headers;
    // check if authorization header exists
    if (!validateTokenStructure(authorization)) throw new Unauthorized();
    // get jwt token
    const token = (authorization as string).split(' ')[1].trim();
    // check access token
    let id, key;
    try {
      ({ id, key } = verify(token, JWT_SECRET) as any);
    } catch (error) {
      throw new Unauthorized();
    }
    // check user auth key
    const user = await UserModel.findById(id);
    if (!user || user.key !== key) throw new Forbidden();
    // attach user info
    req.body.user = user;
    next();
  }
}

/**
 * Authentication middleware with refresh token (HTTP only cookie).
 */
@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: NextFunction) {
    const refresh_token = req.cookies[REFRESH_COOKIE];
    // check if refresh exists
    if (typeof refresh_token !== 'string' || refresh_token === '') throw new Unauthorized();
    // check access token
    let id, key;
    try {
      ({ id, key } = verify(refresh_token, JWT_REFRESH_SECRET) as any);
    } catch (error) {
      throw new Unauthorized();
    }
    // check user auth key
    const user = await UserModel.findById(id);
    if (!user || user.key !== key) throw new Forbidden();
    // attach user info
    req.body.user = user;
    next();
  }
}
