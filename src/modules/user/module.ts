import { UserService } from './service';
import { User, UserSchema } from './schema';
import { UserController } from './controller';
import { PinModule } from '@modules/pin/module';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    forwardRef(() => PinModule)
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
