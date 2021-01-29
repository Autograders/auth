import axios from 'axios';
import constants from '../../constants';

import { NextFunction, Request, Response } from 'express';
import { ISubmit, Submit, Task, User } from '../../models';

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const arn = req.headers['x-amz-sns-topic-arn'];
    if (arn && arn === constants.AWS_S3_ARN) {
      // parse body
      const data = JSON.parse(req.body);
      // subscribe to topic ?
      if (data.SubscribeURL) {
        await axios.get(data.SubscribeURL);
        res.sendStatus(200);
      } else if (data.Message) {
        const message = JSON.parse(data.Message).Records[0];
        req.body = {};
        const fileName = message.s3.object.key.split('.')[0].trim();
        const [taskId, userId] = fileName.split('-');
        req.body.awsRegion = message.awsRegion;
        req.body.eventTime = message.eventTime;
        req.body.bucket = message.s3.bucket.name;
        req.body.key = message.s3.object.key;
        req.body.taskId = taskId;
        req.body.userId = userId;
        next();
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    constants.LOGGER.error(error);
    res.sendStatus(500);
  }
}

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkData(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId, userId } = req.body;
    // check if tasks exists
    const task = await Task.findOne({ taskId });
    if (!task) {
      res.sendStatus(400);
      return;
    }
    // check user
    const user = await User.findById(userId);
    if (!user) {
      res.sendStatus(400);
      return;
    }
    // check submit
    const submit = await Submit.findOne({ taskId, userId, queued: true, ready: false });
    if (!submit) {
      res.sendStatus(400);
      return;
    }
    req.body.submit = submit;
    next();
  } catch (error) {
    constants.LOGGER.error(error);
    res.sendStatus(500);
  }
}

/**
 * Updates submit ready state.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function updateSubmit(req: Request, res: Response) {
  try {
    const submit = req.body.submit as ISubmit;
    submit.ready = true;
    await submit.save();
    res.sendStatus(200);
  } catch (error) {
    constants.LOGGER.error(error);
    res.sendStatus(500);
  }
}

export default [checkMessage, checkData, updateSubmit];
