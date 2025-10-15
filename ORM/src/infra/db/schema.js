import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').primaryKey(),
  url: text('url').notNull().unique(),
  legenda: text('legenda'),
  codigo: text('codigo').notNull().unique(),
  clicks: integer('clicks').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow()
});
