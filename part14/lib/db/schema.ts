import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    token: text("token"),
  },
  (table) => [uniqueIndex("users_username_unique").on(table.username), uniqueIndex("users_token_unique").on(table.token)],
);

export const blogs = pgTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    url: text("url").notNull(),
    likes: integer("likes").notNull().default(0),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("blogs_user_id_idx").on(table.userId)],
);

export const readingList = pgTable(
  "reading_list",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    blogId: integer("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    read: boolean("read").notNull().default(false),
  },
  (table) => [
    uniqueIndex("reading_list_user_blog_unique").on(table.userId, table.blogId),
    index("reading_list_user_id_idx").on(table.userId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  readingList: many(readingList),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
  readingList: many(readingList),
}));

export const readingListRelations = relations(readingList, ({ one }) => ({
  user: one(users, {
    fields: [readingList.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [readingList.blogId],
    references: [blogs.id],
  }),
}));
