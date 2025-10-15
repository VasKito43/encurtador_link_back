import { randomUUID } from 'node:crypto';
import db from '../../infra/database.js'; // Importamos nosso pool de conexão

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

    const sql = 'UPDATE links SET url = $1, legenda = $2 WHERE id = $4 RETURNING *';
    const values = [url, legenda, id];

    const result = await this.db.query(sql, values);
    return result.rows[0] || null;
  }

  async remove(id) {
    // O .query retorna um objeto de resultado. rowCount informa quantas linhas foram afetadas.
    const result = await this.db.query('DELETE FROM links WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}