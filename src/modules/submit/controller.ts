import { IUser } from '@models/user';
import { User } from '@common/decorators';
import { SubmitService } from './service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Query } from '@nestjs/common';

/**
 * Submit controller.
 */
@Controller('submit')
export class SubmitController {
  /** Submit service */
  private readonly submitService!: SubmitService;

  /**
   * Creates a new submit controller.
   *
   * @param submitService - Submit service
   */
  constructor(submitService: SubmitService) {
    this.submitService = submitService;
  }

  /**
   * Create submit endpoint.
   *
   * @param file - Submit file
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: any, @User() user: IUser) {
    return this.submitService.create(file, user.id);
  }

  /**
   * Find submits by task id endpoint.
   *
   * @param id   - Task id
   * @param type - Search type (all, last)
   * @param user - User from session
   */
  @Get(':id')
  findByTaskId(@Param('id') id: string, @Query('type') type: string, @User() user: IUser) {
    if (type === 'last') return this.submitService.findLastByTaskId(id, user);
    return this.submitService.findAllByTaskId(id, user);
  }
}
