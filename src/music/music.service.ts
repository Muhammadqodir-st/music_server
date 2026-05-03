import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/drizzle';
import { musicsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MusicService {

    async getAll() {
        return await db.select().from(musicsTable);
    };

    async getById(id) {
        const music = await db.select().from(musicsTable).where(eq(musicsTable.id, id));

        if (music.length === 0) throw new NotFoundException("Music not found");

        return music;
    };
};
