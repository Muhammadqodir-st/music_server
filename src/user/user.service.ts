import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/drizzle';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { updateDto } from './dto/update.dto';

@Injectable()
export class UserService {

    async getAll() {
        const users = await db.query.usersTable.findMany();

        return users;
    };

    async getById(userId: string) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));

        if (user.length === 0) {
            throw new NotFoundException("User not found");
        };

        return user;
    };

    async update(userId, dto: updateDto) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));

        if (user.length === 0) {
            throw new NotFoundException("User not found");
        };

        return await db.update(usersTable).set(dto).where(eq(usersTable.id, user[0].id)).returning();
    };

    async delete(userId) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));

        if (user.length === 0) {
            throw new NotFoundException("User not found");
        };

        const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, userId));

        return { message: "User deleted" };
    };
};
