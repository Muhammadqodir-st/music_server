import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/db/drizzle";
import { userTable } from "src/db/schema";
import { IUser } from "./types/user.type";

@Injectable()
export class AuthRepository {
    async findByEmail(email: string) {
        return await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });
    };

    async findByProfileEmail(email: string) {
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });
        return user
    };

    createUser(user: IUser) {
        return db.insert(userTable).values({
            name: user.name,
            email: user.email,
        }).returning();
    };
};