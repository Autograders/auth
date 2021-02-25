import { UserService } from './service';
import { Module } from '@nestjs/common';
import { UserController } from './controller';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
