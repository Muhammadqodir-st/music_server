import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/drizzle';
import { musicsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { MusicDto } from './dto/music.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class MusicService {

    constructor(private readonly awsService: AwsService) { };

    async getAll() {
        return await db.select().from(musicsTable);
    };

    async getById(id:string) {
        const music = await db.select().from(musicsTable).where(eq(musicsTable.id, id));

        if (music.length === 0) throw new NotFoundException("Music not found");

        return music;
    };

    async createMusic(userId, dto: MusicDto, artwork?: Express.Multer.File, song?: Express.Multer.File) {
        let artworkUrl: string | undefined;
        let songUrl: string | undefined;

        if (artwork) {
            const { url } = await this.awsService.uploadArtwork(artwork);
            artworkUrl = url;
        };

        if (song) {
            const { url } = await this.awsService.uploadMusic(song);
            songUrl = url;
        };

        if (!songUrl) {
            throw new BadRequestException("Music file is required");
        };

        const [music] = await db.insert(musicsTable).values({
            title: dto.title,
            artwork: artworkUrl,
            song: songUrl,
            userId: userId
        }).returning();

        return music;
    };

    async deleteById(id: string) {
        const music = await db.select().from(musicsTable).where(eq(musicsTable.id, id));

        if (music.length === 0) {
            throw new NotFoundException("Music not found");
        };

        await db.delete(musicsTable).where(eq(musicsTable.id, id));

        return "Music deleted";
    };
};
