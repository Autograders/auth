import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@constants';
import { UserModel } from '@models/user';
import { validateTokenStructure } from '@utils';
import { Forbidden, Unauthorized } from '@errors';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

/**
 * Authentication middleware.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
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
