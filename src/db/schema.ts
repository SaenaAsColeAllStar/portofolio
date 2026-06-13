import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
