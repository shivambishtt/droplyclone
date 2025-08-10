import { integer, pgTable, varchar, text, uuid, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    size:integer("size").notNull(),
    type:text("type").notNull(), // "folder"

    

})