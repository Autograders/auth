import Joi from 'joi';
import middleware from '../../middleware';

import { Task } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Create task schema.
 */
const schema = Joi.object({
  user: Joi.object().required(),
  taskId: Joi.string().min(3).max(255).required(),
  taskName: Joi.string().min(3).max(255).required(),
  maxTries: Joi.number().min(3).max(30).required()
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
    if (await Task.exists({ taskId })) {
      res.status(400).json({ message: `Task with id '${taskId}' already exists` });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Creates task and saves it in DB.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function createTask(req: Request, res: Response) {
  try {
    const { taskId, taskName, maxTries } = req.body;
    // create task
    const task = new Task();
    task.taskId = taskId;
    task.taskName = taskName;
    task.maxTries = maxTries;
    await task.save();
    res.status(200).json({ message: `Task with id '${taskId}' created successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticatedAdmin, validate, checkTask, createTask];
