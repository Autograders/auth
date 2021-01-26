import jwt from 'jsonwebtoken';
import constants from '../../constants';

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
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const data = jwt.verify(refresh_token, refreshSecret) as any;
    const email = data.email as string;
    if (await Token.exists({ email, token: refresh_token })) {
      req.body.data = { id: data.id, email: data.email };
      next();
    } else {
      res.clearCookie('refresh_token');
      res.sendStatus(403);
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
    // create jwts
    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(data, tokenSecret, { expiresIn: constants.TOKEN_TIME });
    res.status(200).json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkToken, refreshToken];
