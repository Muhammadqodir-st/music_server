import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/db/drizzle";
import { userTable } from "src/db/schema";

@Injectable()
export class AuthRepository {
    async findByEmail(email: string) {
        return await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });
    };
}