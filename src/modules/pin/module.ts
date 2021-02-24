import { PinService } from './service';
import { Pin, PinSchema } from './schema';
import { PinController } from './controller';
import { UserModule } from '@modules/user/module';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pin.name,
        schema: PinSchema
      }
    ]),
    forwardRef(() => UserModule)
  ],
  exports: [
    MongooseModule.forFeature([
      {
        name: Pin.name,
        schema: PinSchema
      }
    ])
  ],
  controllers: [PinController],
  providers: [PinService]
})
export class PinModule {}
