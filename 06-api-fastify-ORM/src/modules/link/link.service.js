// src/modules/link/link.service.js
import { randomBytes } from 'node:crypto';

function generateCode(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) {
    s += chars[bytes[i] % chars.length];
  }
  return s;
}

export class LinkService {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async findAll() {
    return this.linkRepository.findAll();
  }

  async create(linkData) {
    if (!linkData || !linkData.url) {
      throw new Error('URL é obrigatória.');
    }

    // Validação básica de URL
    try {
      // lançará se inválida
      new URL(linkData.url);
    } catch (err) {
      throw new Error('Formato de link inválido.');
    }

    // Verifica se a URL já existe
    const existing = await this.linkRepository.findByUrl(linkData.url);
    if (existing) {
      throw new Error('Este link já está em uso.');
    }

    // Gera código curto e garante unicidade
    let codigo;
    do {
      codigo = generateCode(6); // ex: 'z2482j'
    } while (await this.linkRepository.findByCode(codigo));

    const payload = {
      url: linkData.url,
      legenda: linkData.legenda || null,
      codigo
    };

    return this.linkRepository.create(payload);
  }

  async update(id, linkData) {
    const found = await this.linkRepository.findById(id);
    if (!found) {
      throw new Error('Link não encontrado.');
    }
    // validar URL se estiver sendo atualizada
    if (linkData.url) {
      try {
        new URL(linkData.url);
      } catch (err) {
        throw new Error('Formato de link inválido.');
      }
    }
    return this.linkRepository.update(id, linkData);
  }

  async delete(id) {
    const found = await this.linkRepository.findById(id);
    if (!found) {
      throw new Error('Link não encontrado.');
    }
    return this.linkRepository.delete(id);
  }

  async incrementAndGetUrlByCode(codigo) {
    const row = await this.linkRepository.incrementClicksAndGetByCode(codigo);
    if (!row) return null;
    // dependendo do formato retornado, row.url deve existir
    return { url: row.url, id: row.id, clicks: row.clicks };
  }
}
