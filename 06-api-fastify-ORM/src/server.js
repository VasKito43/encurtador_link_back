import fastify from "fastify";
import { linkRoutes } from "./modules/link/link.route.js";
import { LinkRepository } from "./modules/link/link.repository.js";
import { LinkService } from "./modules/link/link.service.js";
import { LinkController } from "./modules/link/link.controller.js";

const server = fastify();
const port = 3000;

// registra rotas CRUD no prefix /links
server.register(linkRoutes, { prefix: "/links" });

// --- ROTA DE REDIRECIONAMENTO NA RAIZ /:code ---
const linkRepository = new LinkRepository();
const linkService = new LinkService(linkRepository);
const linkController = new LinkController(linkService);

// rota global de redirecionamento
server.get('/:code', (request, reply) => linkController.redirect(request, reply));
// --------------------------------------------------

async function start() {
  try {
    const address = await server.listen({ port });
    console.log("HTTP server running on", address);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
