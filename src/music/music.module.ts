import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { AwsModule } from '../aws/aws.module';

@Module({
    imports: [AwsModule],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule { }
