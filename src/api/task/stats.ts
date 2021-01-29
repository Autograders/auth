import constants from '../../constants';
import middleware from '../../middleware';
import fileUpload from 'express-fileupload';

import { Grade } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function validate(req: Request, res: Response, next: NextFunction) {
  if (!req.params.taskId) {
    res.status(400).json({ message: 'Task id not provided' });
  } else {
    next();
  }
}

/**
 * Get task stats.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function getStats(req: Request, res: Response) {
  try {
    const { taskId } = req.params;
    const userId = req.body.user.id;
    const grades = await Grade.find({ taskId, userId }).sort({ createdAt: 'desc' }).exec();
    if (!grades || grades.length === 0) {
      res.status(400).json({ message: `No task stats available for task with id '${taskId}'` });
      return;
    } else {
      res.status(200).json({ grade: grades[0] });
    }
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

export default [...middleware.checkAuthenticated, fileUpload(), validate, getStats];
