import S3 from 'aws-sdk/clients/s3';
import constants from '../../constants';
import middleware from '../../middleware';
import fileUpload from 'express-fileupload';

import { Grade, Task, User } from '../../models';
import { NextFunction, Request, Response } from 'express';

/**
 * S3 client
 */
const s3 = new S3();

/**
 * Uploads file to S3 bucket.
 *
 * @param params - Put object request
 */
function uploadFile(params: S3.PutObjectRequest): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    s3.upload(params, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

/**
 * Validates request payload.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function validate(req: Request, res: Response, next: NextFunction) {
  if (!req.files?.task) {
    req.body.task = req.files?.task;
    res.status(400).json({ message: 'Task file not provided' });
  } else {
    next();
  }
}

/**
 * Checks grade.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function checkGrade(req: Request, res: Response, next: NextFunction) {
  try {
    const submit = req.files?.task as fileUpload.UploadedFile;
    const fileName = submit.name.split('.')[0].trim();
    const [taskId, userId] = fileName.split('-');
    // check if tasks exists
    const task = await Task.findOne({ taskId });
    if (!task) {
      res.status(400).json({ message: `Invalid task id '${taskId}'` });
      return;
    }
    // check user
    const user = await User.findById(userId);
    if (!user || user.id !== req.body.user.id) {
      res.status(400).json({ message: `Invalid user id '${userId}'` });
      return;
    }
    // check max tries
    const grades = await Grade.find({ userId, taskId });
    if (grades && grades.length >= task.maxTries) {
      res.status(400).json({ message: `Max tries exceeded` });
      return;
    }
    // check if task already queued
    const queued = await Grade.findOne({ userId, taskId, queued: true });
    if (queued) {
      res.status(400).json({ message: `Task id '${taskId}' is already queued.` });
      return;
    }
    req.body.taskId = taskId;
    req.body.userId = userId;
    next();
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try agin' });
  }
}

/**
 * Upload file to S3 bucket.
 *
 * @param req  - Request object
 * @param res  - Response object
 * @param next - Next function
 */
async function saveFile(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.files?.task as fileUpload.UploadedFile;
    const fileName = file.name.trim();
    await uploadFile({
      Bucket: constants.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.data
    });
    next();
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

/**
 * Creates grade and saves it in DB.
 *
 * @param req - Request object
 * @param res - Response object
 */
async function createGrade(req: Request, res: Response) {
  try {
    const { taskId, userId } = req.body;
    // create user
    const grade = new Grade();
    grade.userId = userId;
    grade.taskId = taskId;
    grade.queued = true;
    grade.grade = 0;
    grade.details = [];
    grade.stderr = '';
    grade.stdout = '';
    await grade.save();
    res.status(200).json({ message: `Submit with id '${grade.id}' queued successfully` });
  } catch (error) {
    constants.LOGGER.error(error);
    res.status(500).json({ message: 'Internal server error, try again' });
  }
}

export default [...middleware.checkAuthenticated, fileUpload(), validate, checkGrade, saveFile, createGrade];
