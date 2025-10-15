// Importamos o Model para que o Controller possa interagir com ele.
import { LinkService } from './link.service.js';

export class LinkController {

  // Agora o Controller RECEBE o serviço.
  constructor(linkService) {
    this.linkService = linkService;
  }

  // Método para lidar com a busca de todos os contatos
  async findAll(request, reply) {
    try {
      const links = await this.linkService.findAll();
      return reply.status(200).send(links);
    } catch (error) {
      // Tratamento de erro genérico
      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  // Método para lidar com a criação de um novo contato
  async create(request, reply) {
    try {
      const { url, legenda } = request.body;

      // Validação básica de entrada no controller
      if (!url) {
        return reply.status(400).send({ message: 'URL são obrigatórios.' });
      }

      // Delega a criação e as regras de negócio para o Model
      const newLink = await this.linkService.create({ url, legenda });

      return reply.status(201).send(newLink);
    } catch (error) {
      // Captura os erros de negócio lançados pelo Model
      if (error.message.includes('url já cadastrada')) {
        // Retorna um erro 400 (Bad Request) para erros de validação
        return reply.status(400).send({ message: error.message });
      }

      // Se for outro tipo de erro, trata como um erro genérico
      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async update(request, reply) {
    try {
      const { id } = request.params;
      const { url, legenda } = request.body;

      // Validação básica de entrada no controller
      if (!url) {
        return reply.status(400).send({ message: 'URL é obrigatória.' });
      }

      const updatedLink = await this.linkService.update(id, { url, legenda });

      return reply.status(200).send(updatedLink);
    } catch (error) {
      if (error.message === 'Link    não encontrado.') {
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

      // Status 204 (No Content) é a resposta padrão para uma exclusão bem-sucedida.
      return reply.status(204).send();
      
    } catch (error) {
      if (error.message === 'Link não encontrado.') {
        return reply.status(404).send({ message: error.message });
      }

      console.error(error);
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }

  }
}