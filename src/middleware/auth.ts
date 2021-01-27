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
    if (!req.cookies.refresh_token) {
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
    const { refresh_token } = req.cookies;
    const data = jwt.verify(refresh_token, constants.JWT_REFRESH_SECRET) as any;
    const { id, key } = data;
    const user = await User.findById(id);
    if (!user || user.key !== key) {
      res.clearCookie('refresh_token');
      res.sendStatus(403);
    } else {
      req.body.user = user;
      next();
    }
  } catch (error) {
    res.clearCookie('refresh_token');
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
      res.clearCookie('refresh_token');
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (error) {
    res.clearCookie('refresh_token');
    res.sendStatus(403);
  }
}

/** Check user authentication middleware */
export const checkAuthenticated = [validate, checkToken];

/** Check admin authentication middleware */
export const checkAuthenticatedAdmin = [validate, checkToken, isAdmin];
