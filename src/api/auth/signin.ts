import Joi from 'joi';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import passwordComplexity from 'joi-password-complexity';

import { IUser, User, Token } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Sign in validation schema.
 */
const schema = Joi.object({
  email: Joi.string().email().required(),
  keepMeSigned: Joi.boolean().default(false),
  password: passwordComplexity(constants.PASSWORD_COMPLEXITY)
}).required();

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function validate(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await schema.validateAsync(req.body);
    const email = req.body.email.toLowerCase();
    if (email.endsWith(constants.EMAIL_DOMAIN)) {
      req.body.keepMeSigned = data.keepMeSigned;
      next();
    } else {
      res.status(400).json({ message: `Only '${constants.EMAIL_DOMAIN}' emails allowed` });
    }
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
  }
}

/**
 * Checks if user already exists in DB.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
      res.status(400).json({ message: `User '${email}' doesn't exists` });
    } else if (!user.verified) {
      res.status(400).json({ message: `User '${email}' is not verified` });
    } else {
      req.body.user = user;
      req.body.hash = user.password;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Checks plain password against argon2 hash.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkPassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (await argon2.verify(req.body.hash, req.body.password)) {
      next();
    } else {
      res.status(400).json({ message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

/**
 * Creates refresh and access token.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function createTokens(req: Request, res: Response) {
  try {
    const user = req.body.user as IUser;
    const email = req.body.email as string;
    const keepMeSigned = req.body.keepMeSigned as boolean;
    const id = user.id;
    const data = { id, email };
    // create jwts
    const tokenSecret = process.env.JWT_SECRET as string;
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const token = jwt.sign(data, tokenSecret, { expiresIn: constants.TOKEN_TIME });
    let refreshToken = '';
    // save refresh token in DB
    if (keepMeSigned) {
      refreshToken = jwt.sign(data, refreshSecret, { expiresIn: constants.REFRESH_TOKEN_TIME_EXT });
    } else {
      refreshToken = jwt.sign(data, refreshSecret, { expiresIn: constants.REFRESH_TOKEN_TIME });
    }
    // create DB token
    const dbToken = new Token();
    dbToken.email = email;
    dbToken.token = refreshToken;
    await dbToken.save();
    // set refresh token cookie
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkUser, checkPassword, createTokens];
