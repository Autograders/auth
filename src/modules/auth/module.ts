import { AuthService } from './service';
import { AuthController } from './controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClaimsMiddleware, RefreshMiddleware } from '@common/middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClaimsMiddleware).forRoutes('auth/signout');
    consumer.apply(RefreshMiddleware).forRoutes('auth/refresh');
  }
}
