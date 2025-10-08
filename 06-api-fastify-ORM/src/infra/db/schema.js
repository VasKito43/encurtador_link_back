import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

// Definimos a tabela "links", espelhando a estrutura do nosso SQL
export const links = pgTable('links', {
  id: uuid('id').primaryKey(),
  url: text('url').notNull().unique(),
  legenda: text('legenda').unique(),
  codigo: text('codigo').notNull()
});