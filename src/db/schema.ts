import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", ["email", "google"]);

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    avatar: text("avatar"),
    provider: providerEnum("provider").notNull().default("email"),
    googleId: text("google_id"),
    createdAt: timestamp("createdAt").notNull().defaultNow()
});