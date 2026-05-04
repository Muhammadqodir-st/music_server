import { pgEnum, pgTable, text, timestamp, uuid, uniqueIndex, index, integer } from "drizzle-orm/pg-core";

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

export const musicsTable = pgTable("musics", {
    id: uuid().primaryKey().defaultRandom(),
    title: text("title").notNull(),
    artwork: text("artwork").default("https://community.spotify.com/t5/image/serverpage/image-id/196380iDD24539B5FCDEAF9/image-size/medium?v=v2&px=400"),
    song: text("song").notNull(),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").notNull().defaultNow()
}, (t) => ({
    userIdIdx: index("musics_user_id_idx").on(t.userId)
})); 