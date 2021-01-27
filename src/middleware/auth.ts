import jwt from 'jsonwebtoken';
import constants from '../constants';

import { User } from '../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function validate(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      res.sendStatus(401);
    } else {
      next();
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

/**
 * Checks refresh token.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization as string;
    const data = jwt.verify(authorization, constants.JWT_SECRET) as any;
    const { id, key } = data;
    const user = await User.findById(id);
    if (!user || user.key !== key) {
      res.sendStatus(403);
    } else {
      req.body.user = user;
      next();
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

/**
 * Checks if user is admin.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = req.body.user.admin;
    if (!admin) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

/** Check user authentication middleware */
export const checkAuthenticated = [validate, checkToken];

/** Check admin authentication middleware */
export const checkAuthenticatedAdmin = [validate, checkToken, isAdmin];
