import jwt from 'jsonwebtoken';
import constants from '../../constants';

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
      res.sendStatus(401);
    } else {
      next();
    }
  } catch (error) {
    res.clearCookie('refresh_token');
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
    const { id, email, key } = data;
    const user = await User.findById(id);
    if (!user || user.key !== key) {
      res.clearCookie('refresh_token');
      res.sendStatus(403);
    } else {
      req.body.data = { id, email, key };
      next();
    }
  } catch (error) {
    res.clearCookie('refresh_token');
    res.sendStatus(403);
  }
}

/**
 * Refreshes access token.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function refreshToken(req: Request, res: Response) {
  try {
    const { data } = req.body;
    const token = jwt.sign(data, constants.JWT_SECRET, { expiresIn: constants.TOKEN_TIME });
    const refreshToken = jwt.sign(data, constants.JWT_REFRESH_SECRET, { expiresIn: constants.REFRESH_TOKEN_TIME });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkToken, refreshToken];
