import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL as string, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    UserModule
  ]
})
export class AppModule {}
