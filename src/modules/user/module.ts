import { UserService } from './service';
import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { PinModule } from '@modules/pin/module';

@Module({
  imports: [PinModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
