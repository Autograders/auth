import { UserService } from './service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './schema';
import { UserController } from './controller';
import { PinModule } from '@modules/pin/module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    PinModule
  ],
  exports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
