import { Module } from '@nestjs/common';
import { PinModule } from './pin/module';
import { AuthModule } from './auth/module';
import { TaskModule } from './task/module';
import { UserModule } from './user/module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, PinModule, TaskModule, UserModule]
})
export class AppModule {}
