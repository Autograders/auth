import jwt from 'jsonwebtoken';
import constants from '../../constants';

import { v4 } from 'uuid';
import { User } from '../../models';
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
      res.clearCookie('refresh_token');
      res.status(200).json({ message: 'Sign out successfully' });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
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
    req.body.id = data.id;
    next();
  } catch (error) {
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Sign out successfully' });
  }
}

/**
 * Sign out.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function signOut(req: Request, res: Response) {
  try {
    const { id, allDevices = false } = req.body;
    // sign out in all devices ?
    if (allDevices) {
      // invalidate tokens by changing user key
      const user = await User.findById(id);
      user.key = v4();
      await user.save();
    }
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Sign out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkToken, signOut];
