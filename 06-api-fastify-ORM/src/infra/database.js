// src/infra/database.js
import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // opcional: ssl: { rejectUnauthorized: false } dependendo do provedor
});

export const db = drizzle(pool);
export default db;
