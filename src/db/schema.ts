import { pgEnum, pgTable, text, timestamp, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";

export const ProviderEnum = pgEnum("provider", ["email", "google"]);

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    avatar: text("avatar"),
    provider: ProviderEnum("provider").notNull().default("email"),
    googleId: text("google_id"),
    createdAt: timestamp("createdAt").notNull().defaultNow()
}, (t) => ({
    googleIdUnique: uniqueIndex("users_google_id_unique").on(t.googleId),
    emailIdx: index("users_email_idx").on(t.email)
}));

export const musicTable = pgTable("musics", {
    id: uuid().primaryKey().defaultRandom(),
    title: text("title").notNull(),
    artwork: text("artwork"),
    song: text("song").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow()
});