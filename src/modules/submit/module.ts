import { SubmitService } from './service';
import { SubmitController } from './controller';
import { ClaimsMiddleware } from '@common/middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

@Module({
  controllers: [SubmitController],
  providers: [SubmitService]
})
export class SubmitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClaimsMiddleware)
      .exclude({ path: 'submit/:id', method: RequestMethod.PUT })
      .forRoutes(SubmitController);
  }
}
