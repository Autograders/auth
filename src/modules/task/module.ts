import { TaskService } from './service';
import { TaskController } from './controller';
import { ClaimsMiddleware } from '@common/middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

@Module({
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClaimsMiddleware).exclude({ path: 'task/:id', method: RequestMethod.GET }).forRoutes(TaskController);
  }
}
