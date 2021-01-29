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
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Authorization header not provided' });
  } else {
    next();
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
    let data;
    try {
      data = jwt.verify(authorization, constants.JWT_SECRET) as any;
    } catch (error) {
      res.status(403).json({ message: 'Token expired' });
      return;
    }
    const { id, key } = data;
    const user = await User.findById(id);
    if (!user || user.key !== key) {
      res.status(403).json({ message: 'Token expired' });
    } else {
      req.body.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
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
  const admin = req.body.user.admin;
  if (!admin) {
    res.status(403).json({ message: 'Not an admin user' });
  } else {
    next();
  }
}

/** Check user authentication middleware */
export const checkAuthenticated = [validate, checkToken];

/** Check admin authentication middleware */
export const checkAuthenticatedAdmin = [validate, checkToken, isAdmin];
