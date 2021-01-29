import jwt from 'jsonwebtoken';
import urls from '../../urls';
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
    const { token } = req.params;
    const data = jwt.verify(token, constants.JWT_VERIFY_SECRET);
    req.body.data = data;
    next();
  } catch (error) {
    res.status(200).redirect(urls.TOKEN_EXPIRED);
  }
}

/**
 * Verifies user.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function verify(req: Request, res: Response) {
  try {
    const { id } = req.body.data;
    const user = await User.findById(id);
    user.verified = true;
    await user.save();
    res.status(200).redirect(urls.SIGN_IN);
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(200).redirect(urls.SOMETHING_WENT_WRONG);
  }
}

export default [validate, verify];
