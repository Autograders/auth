import constants from '../../constants';
import middleware from '../../middleware';

import { Task } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Checks if task already exists in DB (get by id).
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    if (taskId && !(await Task.findOne({ taskId }))) {
      res.status(400).json({ message: `Task with id '${taskId}' does not already exists` });
    } else {
      next();
    }
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Get tasks in DB.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function getTasks(req: Request, res: Response) {
  try {
    const { taskId } = req.params;
    if (taskId) {
      res.status(200).json({ task: await Task.findOne({ taskId }) });
    } else {
      res.status(200).json({ tasks: await Task.find() });
    }
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticated, checkTask, getTasks];
