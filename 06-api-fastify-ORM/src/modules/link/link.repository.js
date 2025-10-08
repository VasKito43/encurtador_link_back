// src/modules/link/link.repository.js
import { randomUUID } from 'node:crypto';
import db from '../../infra/database.js';

export class LinkRepository {
  constructor() {
    this.db = db;
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM links ORDER BY id ASC');
    return result.rows;
  }

  async findByUrl(url) {
    const result = await this.db.query('SELECT * FROM links WHERE url = $1', [url]);
    return result.rows[0] || null;
  }

  async findByCode(codigo) {
    const result = await this.db.query('SELECT * FROM links WHERE codigo = $1', [codigo]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await this.db.query('SELECT * FROM links WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(linkData) {
    const { url, legenda, codigo } = linkData;
    const id = randomUUID();
    const sql = 'INSERT INTO links (id, url, legenda, codigo) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [id, url, legenda, codigo];
    const result = await this.db.query(sql, values);
    return result.rows[0];
  }

  async update(id, linkData) {
    const { url, legenda } = linkData;
    // CORREÇÃO: usar $3 para o id (antes estava $4)
    const sql = 'UPDATE links SET url = $1, legenda = $2 WHERE id = $3 RETURNING *';
    const values = [url, legenda, id];
    const result = await this.db.query(sql, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.db.query('DELETE FROM links WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}
