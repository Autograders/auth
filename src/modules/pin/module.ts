import { PinService } from './service';
import { Module } from '@nestjs/common';
import { PinController } from './controller';

@Module({
  controllers: [PinController],
  providers: [PinService]
})
export class PinModule {}
