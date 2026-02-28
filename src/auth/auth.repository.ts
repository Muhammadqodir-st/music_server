import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/db/drizzle";
import { usersTable } from "src/db/schema";
import { IGoogleUser, IUser } from "./types/user.type";

@Injectable()
export class AuthRepository {
    async findByEmail(email: string) {
        return await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email)
        });
    };

    async findByProfileEmail(email: string) {
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email)
        });
        return user
    };

    createUser(user: IUser) {
        return db.insert(usersTable).values({
            name: user.name,
            email: user.email,
        }).returning();
    };

    createGoogleUser(user: IGoogleUser) {
        return db.insert(usersTable).values({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.googleId,
            provider: user.provider,
        }).returning();
    };
};