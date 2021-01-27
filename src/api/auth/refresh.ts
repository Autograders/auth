import jwt from 'jsonwebtoken';
import constants from '../../constants';
import middleware from '../../middleware';

import { IUser } from '../../models';
import { Request, Response } from 'express';

/**
 * Refreshes access token.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function refreshToken(req: Request, res: Response) {
  try {
    const user = req.body.user as IUser;
    const data = { id: user.id, email: user.email, key: user.key };
    const token = jwt.sign(data, constants.JWT_SECRET, { expiresIn: constants.TOKEN_TIME });
    const refreshToken = jwt.sign(data, constants.JWT_REFRESH_SECRET, { expiresIn: constants.REFRESH_TOKEN_TIME });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticated, refreshToken];
