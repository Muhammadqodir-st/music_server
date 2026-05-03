import { Controller, Get, Param } from '@nestjs/common';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
    constructor(private readonly musicServer: MusicService) { }

    @Get()
    getAll() {
        return this.musicServer.getAll();
    };

    @Get("id")
    getById(@Param("id") id: string) {
        return this.musicServer.getById(id);
    };
};
