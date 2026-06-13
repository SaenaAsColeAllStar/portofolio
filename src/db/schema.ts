import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// A simple table to test the connection.
export const testConnection = pgTable('test_connection', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pageViews = pgTable('page_views', {
  path: text('path').primaryKey(),
  count: integer('count').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const guestbook = pgTable('guestbook', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

