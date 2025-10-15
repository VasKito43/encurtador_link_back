// src/modules/link/link.repository.js
import { randomUUID } from 'node:crypto';
import { db } from '../../infra/database.js';
import { links } from '../../infra/db/schema.js';
import { eq, sql } from 'drizzle-orm';

export class LinkRepository {
  constructor() {
    this.db = db;
  }

  async findAll() {
    return await this.db.select().from(links);
  }

  async findByUrl(url) {
    const rows = await this.db.select().from(links).where(eq(links.url, url));
    return rows[0] || null;
  }

  async findByCode(codigo) {
    const rows = await this.db.select().from(links).where(eq(links.codigo, codigo));
    return rows[0] || null;
  }

  async findById(id) {
    const rows = await this.db.select().from(links).where(eq(links.id, id));
    return rows[0] || null;
  }

  async create(linkData) {
    const id = randomUUID();
    const values = { id, url: linkData.url, legenda: linkData.legenda ?? null, codigo: linkData.codigo };
    const inserted = await this.db.insert(links).values(values).returning();
    // returning() geralmente retorna um array com a linha inserida
    return Array.isArray(inserted) ? inserted[0] : inserted;
  }

  async update(id, linkData) {
    const updated = await this.db
      .update(links)
      .set({ url: linkData.url, legenda: linkData.legenda ?? null })
      .where(eq(links.id, id))
      .returning();
    return updated?.[0] || null;
  }

  async delete(id) {
    const res = await this.db.delete(links).where(eq(links.id, id));
    // delete retorna info; aqui consideramos sucesso quando foi afetada 1+ linhas
    // Drizzle pode retornar a contagem em result.rowCount em alguns drivers; ou vazio.
    // Para simples controle, retorne true se findById não mais existir:
    const still = await this.findById(id);
    return still === null;
  }

  async incrementClicksAndGetByCode(codigo) {
  // Atualiza clicks de forma atômica e retorna a linha atualizada
  const updated = await this.db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.codigo, codigo))
    .returning();

  // returning() geralmente retorna um array com a linha atualizada
  return Array.isArray(updated) ? updated[0] || null : (updated || null);
}

}
