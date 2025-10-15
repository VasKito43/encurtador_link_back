

// 1. O arquivo de rotas importa todas as suas dependências.
import { LinkRepository } from './link.repository.js';
import { LinkService } from './link.service.js';
import { LinkController } from './link.controller.js';

// 2. A "linha de montagem" para o módulo de links acontece aqui.
const linkRepository = new LinkRepository();
const linkService = new LinkService(linkRepository);
const linkController = new LinkController(linkService);

export async function linkRoutes(app){

  app.get('/', (request, reply) => linkController.findAll(request, reply));
  app.post('/', (request, reply) => linkController.create(request, reply));
  app.put('/:id', (request, reply) => linkController.update(request, reply));
  app.delete('/:id', (request, reply) => linkController.delete(request, reply));
}
