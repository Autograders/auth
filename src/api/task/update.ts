import Joi from 'joi';
import middleware from '../../middleware';

import { ITask, Task } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Create task schema.
 */
const schema = Joi.object({
  user: Joi.object().required(),
  taskId: Joi.string().required(),
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
    const task = await Task.findOne({ taskId });
    if (!task) {
      res.status(400).json({ message: `Task with id '${taskId}' does not exists` });
    } else {
      req.body.task = task;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Updates task and saves it in DB.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function updateTask(req: Request, res: Response) {
  try {
    const task = req.body.task as ITask;
    const { taskId, taskName, maxTries } = req.body;
    task.taskName = taskName;
    task.maxTries = maxTries;
    await task.save();
    res.status(200).json({ message: `Task with id '${taskId}' updated successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticatedAdmin, validate, checkTask, updateTask];
