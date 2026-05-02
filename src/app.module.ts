import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { MusicService } from './music/music.service';
import { MusicController } from './music/music.controller';
import { MusicModule } from './music/music.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [AuthModule, UserModule, MailerModule, MusicModule, AwsModule],
  controllers: [AppController, MusicController],
  providers: [AppService, MusicService],
})
export class AppModule {}
