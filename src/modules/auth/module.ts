import { AuthService } from './service';
import { AuthController } from './controller';
import { AuthMiddleware } from '@common/middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/refresh', 'auth/signout');
  }
}
