import { getUTC } from '@utils';
import { TaskModel } from '@models/task';
import { CreateTaskDto } from './dto/create';
import { InvalidTaskId } from './exceptions';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  /**
   * Creates task.
   *
   * @param data - Create task data
   */
  async create(data: CreateTaskDto) {
    const task = new TaskModel();
    task.name = data.name;
    task.tries = data.tries;
    task.files = data.files;
    task.due = getUTC(data.due);
    await task.save();
    return { message: `Task '${data.name}' created successfully` };
  }

  /**
   * Gets all tasks.
   */
  async findAll() {
    return (await TaskModel.find().exec()).map((task) => ({
      id: task.id,
      name: task.name,
      tries: task.tries,
      due: task.due,
      files: task.files,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
  }

  /**
   * Find task by id.
   *
   * @param id - Task identifier
   */
  async findOne(id: string) {
    const task = await TaskModel.findById(id).exec();
    if (!task) throw new InvalidTaskId(id);
    return {
      id: task.id,
      name: task.name,
      tries: task.tries,
      due: task.due,
      files: task.files,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  /**
   * Updates task by id.
   *
   * @param id   - Task identifier
   * @param data - Update task data
   */
  async update(id: string, data: CreateTaskDto) {
    const task = await TaskModel.findById(id).exec();
    if (!task) throw new InvalidTaskId(id);
    task.name = data.name;
    task.tries = data.tries;
    task.files = data.files;
    task.due = getUTC(data.due);
    task.updatedAt = getUTC();
    await task.save();
    return { message: `Task with id '${id}' updated successfully` };
  }

  /**
   * Delete task by id.
   *
   * @param id - Task identifier
   */
  async remove(id: string) {
    const task = await TaskModel.findById(id).exec();
    if (!task) throw new BadRequestException();
    await task.remove();
    return { message: `Task with id '${id}' deleted successfully` };
  }

  /**
   * Deletes all tasks.
   */
  async removeAll() {
    await TaskModel.deleteMany({}).exec();
    return { message: 'Tasks deleted successfully' };
  }
}
