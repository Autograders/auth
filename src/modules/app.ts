import { Module } from '@nestjs/common';
import { AuthModule } from './auth/module';
import { UserModule } from '@modules/user/module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, AuthModule]
})
export class AppModule {}
