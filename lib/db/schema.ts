import { integer, pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(),

    // storage
    fileURL: text("field_url").notNull(),
    thumbmailURL: text("thumbnail_url"),

    // who belongs to who
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"),// parent folder if null for root  

    // file/folder flags
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),

    // timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

})
// relations drizzle orm
export const filesRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parentId], //acts as a foreign key
        references: [files.id],
    }),
    // could be many file inside the folder 
    children: many(files)
}))

export const File = typeof files.$inferSelect // inferSelect basically creates type of file behind the scene. 
export const NewFile = typeof files.$inferInsert    //Changing the schema will also change the inferSelect