import Joi from 'joi';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import passwordComplexity from 'joi-password-complexity';

import { User } from '../../models';
import { sendEmail } from '../../email';
import { NextFunction, Request, Response } from 'express';

/**
 * Sign up validation schema.
 */
const schema = Joi.object({
  fullName: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
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
    await schema.validateAsync(req.body);
    const email = req.body.email.toLowerCase();
    if (email.endsWith(constants.EMAIL_DOMAIN)) {
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
    if (await User.exists({ email })) {
      res.status(400).json({ message: `User '${email}' already exists` });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Hashes password using argon2 algorithm.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function hashPassword(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.password = await argon2.hash(req.body.password);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

/**
 * Creates user and saves it in DB.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, password } = req.body;
    // create user
    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.password = password;
    await user.save();
    req.body.id = user.id;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

/**
 * Sends verification email.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function sendVerificationEmail(req: Request, res: Response) {
  try {
    const { id, email } = req.body;
    const data = { id, email };
    const token = jwt.sign(data, constants.JWT_VERIFY_SECRET, {
      expiresIn: constants.VERIFY_TOKEN_TIME
    });
    sendEmail({
      to: email,
      subject: 'Verify your email',
      template: 'verify',
      data: {
        email,
        url: `http://localhost:5000/api/auth/verify/${token}`
      }
    });
    res.status(200).json({ message: `User with id '${id}' created successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [validate, checkUser, hashPassword, createUser, sendVerificationEmail];
