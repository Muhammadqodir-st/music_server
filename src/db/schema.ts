import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow()
})