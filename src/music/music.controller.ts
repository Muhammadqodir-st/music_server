import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MusicService } from './music.service';
import { AuthGuard } from './guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MusicDto } from './dto/music.dto';

@Controller('music')
export class MusicController {
    constructor(private readonly musicServer: MusicService) { }

    @Get()
    getAll() {
        return this.musicServer.getAll();
    };

    @Get("/:id")
    getById(@Param("id") id: string) {
        return this.musicServer.getById(id);
    };

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([{ name: "artwork", maxCount: 1 }, { name: "song", maxCount: 1 }]))
    createMusic(
        @UploadedFiles() files: { artwork: Express.Multer.File, song: Express.Multer.File },
        @Req() req: any,
        @Body() dto: MusicDto
    ) {
        return this.musicServer.createMusic(req.user.id, dto, files.artwork, files.song);
    };

    @Delete("/:id")
    deleteById(@Param("id") id: string) {
        return this.musicServer.deleteById(id);
    };
};
