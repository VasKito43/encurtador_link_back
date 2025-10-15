// drizzle.config.js
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Ajuste os caminhos se necessário
export default defineConfig({
  schema: './src/infra/db/schema.js', // caminho para seu schema Drizzle
  out: './drizzle',                   // pasta onde as migrations serão geradas
  dialect: 'postgresql',              // <-- obrigatório: 'postgresql' | 'mysql' | 'sqlite' | 'turso' ...
  dbCredentials: {
    url: process.env.DATABASE_URL     // use a variável do .env
  }
});
