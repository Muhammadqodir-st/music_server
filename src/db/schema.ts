import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow()
});