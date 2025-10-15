export class LinkController {

  constructor(linkService) {
    this.linkService = linkService;
  }

  async findAll(request, reply) {
    try {
      const links = await this.linkService.findAll();
      return reply.status(200).send(links);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async create(request, reply) {
    try {
      const { url, legenda } = request.body;

      if (!url) {
        return reply.status(400).send({ message: 'URL são obrigatórios.' });
      }

      const newLink = await this.linkService.create({ url, legenda });

      return reply.status(201).send(newLink);
    } catch (error) {
      if (error.message.includes('url já cadastrada')) {
        return reply.status(400).send({ message: error.message });
      }

      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async update(request, reply) {
    try {
      const { id } = request.params;
      const { url, legenda } = request.body;

      if (!url) {
        return reply.status(400).send({ message: 'URL é obrigatória.' });
      }

      const updatedLink = await this.linkService.update(id, { url, legenda });

      return reply.status(200).send(updatedLink);
    } catch (error) {
      if (error.message === 'Link não encontrado.') {
        return reply.status(404).send({ message: error.message });
      }
      if (error.message.includes('url já cadastrada')) {
        return reply.status(400).send({ message: error.message });
      }

      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }

  }

  async delete(request, reply) {
    try {
      const { id } = request.params;
      await this.linkService.delete(id);

      return reply.status(204).send();

    } catch (error) {
      if (error.message === 'Link não encontrado.') {
        return reply.status(404).send({ message: error.message });
      }

      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }

  }

async redirect(request, reply) {
  try {
    const { code } = request.params;

    if (!code || !/^[A-Za-z0-9_-]+$/.test(code)) {
      return reply.status(404).send({ message: 'Link não encontrado.' });
    }

    const result = await this.linkService.incrementAndGetUrlByCode(code);

    if (!result || !result.url) {
      return reply.status(404).send({ message: 'Link não encontrado.' });
    }

    const destination = result.url;

    try {
      new URL(destination);
    } catch (err) {
      console.error('URL inválida no DB:', destination);
      return reply.status(500).send({ message: 'URL de destino inválida.' });
    }


    reply.header('location', destination).status(302).send();
  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    return reply.status(500).send({ message: 'Erro interno no servidor.' });
  }
}



}