import jwt from 'jsonwebtoken';

import { Token } from '../../models';
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
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const data = jwt.verify(refresh_token, refreshSecret) as any;
    req.body.data = { id: data.id, email: data.email };
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
    const { refresh_token } = req.cookies;
    const { data, allDevices = false } = req.body;
    const { email } = data;
    if (allDevices) {
      await Token.deleteMany({ email });
    } else {
      await Token.deleteOne({ email, token: refresh_token });
    }
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Sign out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkToken, signOut];
