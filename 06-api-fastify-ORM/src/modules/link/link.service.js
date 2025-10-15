

export class LinkService {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async findAll() {
    return this.linkRepository.findAll();
  }


  async create(linkData) {
    
    // --- Início da Regra de Negócio ---

    // 1. Validação de formato do link
    if (!linkData.url || !linkData.url.includes('@')) {
      throw new Error('Formato de link inválido.');
    }

    // 2. Verificar se o link já existe (agora iterando sobre os dados em memória)
    const existingLink = await this.linkRepository.findByUrl(linkData.url);

    if (existingLink) {
      throw new Error('Este link já está em uso.');
    }
    // --- Fim da regra de Negócio ---

    // Delega a criação para o Model (Acesso a Dados)
    return this.linkRepository.create(linkData);
  }

  async update(id, linkData) {
    const linkIndex = await this.linkRepository.findIndex(id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado.');
    }

    return this.linkRepository.update(id, linkData);
  }

  async delete(id) {
    const linkIndex = await this.linkRepository.findIndex(id);
    if (linkIndex === -1) {
      throw new Error('Link não encontrado.');
    }

    return this.linkRepository.delete(id);
  }

}