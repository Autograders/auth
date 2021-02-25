import { TaskService } from './service';
import { AdminGuard } from '@common/guards';
import { CreateTaskDto } from './dto/create';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';

/**
 * Task controlller.
 */
@Controller('task')
@UseGuards(AdminGuard)
export class TaskController {
  /** Task service */
  private readonly taskService!: TaskService;

  /**
   * Creates a new task controller.
   *
   * @param taskService - Task service
   */
  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  /**
   * Create task endpoint.
   *
   * @param data - Create task payload
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * Get all tasks endpoint.
   */
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  /**
   * Get task by id endpoint.
   *
   * @param id - Task identifier
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  /**
   * Update task by id endpoint.
   *
   * @param id            - Task identifier
   * @param updateTaskDto - Update task payload
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  /**
   * Delete task by id endpoint.
   *
   * @param id - Task identifier
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  /**
   * Remove all tasks endpoint.
   */
  @Delete()
  removeAll() {
    return this.taskService.removeAll();
  }
}
