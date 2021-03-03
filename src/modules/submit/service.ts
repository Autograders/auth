import { uploadFile } from '@utils';
import { TaskModel } from '@models/task';
import { IUser, UserModel } from '@models/user';
import { SubmitModel } from '@models/submit/model';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SubmitService {
  /**
   * Creates a new submit.
   *
   * @param file - Submit file
   * @param id   - User id
   */
  async create(file: any, id: string) {
    if (!file) throw new BadRequestException('No submit file uploaded');
    const { originalname, buffer } = file;
    const fileName = originalname.split('.')[0].trim() as string;
    // check file name structure
    if (!fileName.match(/^.+-.+$/)) throw new BadRequestException(`Invalid submit file '${originalname}'`);
    const [taskId, userId] = fileName.split('-');
    // check task
    const task = await TaskModel.findById(taskId).exec();
    if (!task) throw new BadRequestException(`Invalid task id '${taskId}'`);
    // check if user exists
    const user = await UserModel.findById(userId).exec();
    if (!user) throw new BadRequestException(`Invalid user id '${userId}'`);
    // check auth user owns the submit
    if (user.id !== id) throw new BadRequestException(`Invalid submit user '${id}'`);
    // check max tries
    const submits = await SubmitModel.countDocuments({ user: user._id, task: task._id }).exec();
    if (submits >= task.tries) throw new BadRequestException(`Max tries exceeded for task '${task.name}'`);
    // check if a submit is already queued
    const queued = await SubmitModel.findOne({ user: user._id, task: task._id, queued: true }).exec();
    if (queued) throw new BadRequestException(`A submit is already in the queue for task '${task.name}'`);
    // upload file
    await uploadFile(originalname, buffer);
    // create submit
    const submit = new SubmitModel();
    submit.user = user._id;
    submit.task = task._id;
    await submit.save();
    return { message: `Submit '${submit.id}' uploaded successfully for task '${task.name}'` };
  }

  /**
   * Find all submits by task id (descending order).
   *
   * @param id   - Task id
   * @param user - User
   */
  async findAllByTaskId(id: string, user: IUser) {
    // check task
    const task = await TaskModel.findById(id).exec();
    if (!task) throw new BadRequestException(`Invalid task id '${id}'`);
    return await (await SubmitModel.find({ task: task._id, user: user._id }).sort({ createdAt: -1 }).exec()).map(
      (e) => ({
        id: e.id,
        grade: e.grade,
        stderr: e.stderr,
        stdout: e.stdout,
        details: e.details,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      })
    );
  }

  /**
   * Finds the last submit record by task id.
   *
   * @param id   - Task id
   * @param user - User
   */
  async findLastByTaskId(id: string, user: IUser) {
    // check task
    const task = await TaskModel.findById(id).exec();
    if (!task) throw new BadRequestException(`Invalid task id '${id}'`);
    // check submits
    const last = await SubmitModel.findOne({ task: task._id, user: user._id });
    if (!last) throw new BadRequestException(`No submits available for task id '${id}'`);
    return {
      id: last.id,
      grade: last.grade,
      stderr: last.stderr,
      stdout: last.stdout,
      details: last.details,
      createdAt: last.createdAt,
      updatedAt: last.updatedAt
    };
  }
}
