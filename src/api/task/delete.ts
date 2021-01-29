import Joi from 'joi';
import constants from '../../constants';
import middleware from '../../middleware';

import { Task } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Create task schema.
 */
const schema = Joi.object({
  user: Joi.object().required(),
  taskId: Joi.string().required()
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
    next();
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
  }
}

/**
 * Checks if task already exists in DB.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.body;
    const task = await Task.findOne({ taskId });
    if (!task) {
      res.status(400).json({ message: `Task with id '${taskId}' does not exists` });
    } else {
      next();
    }
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Deletes task in DB.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function deleteTask(req: Request, res: Response) {
  try {
    const { taskId } = req.body;
    await Task.deleteOne({ taskId });
    res.status(200).json({ message: `Task with id '${taskId}' deleted successfully` });
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticatedAdmin, validate, checkTask, deleteTask];
