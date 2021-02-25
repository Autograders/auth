import { Module } from '@nestjs/common';
import { PinModule } from './pin/module';
import { AuthModule } from './auth/module';
import { UserModule } from '@modules/user/module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, PinModule, UserModule]
})
export class AppModule {}
