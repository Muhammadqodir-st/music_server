import { relations } from "drizzle-orm";
import { musicsTable, usersTable } from "./schema";

export const userRelations = relations(usersTable, ({ many }) => ({
    musics: many(musicsTable)
}));

export const musicsRelations = relations(musicsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [musicsTable.userId],
        references: [usersTable.id]
    })
}));