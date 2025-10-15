// server.js
import fastify from "fastify";
import cors from "@fastify/cors";
import { linkRoutes } from "./modules/link/link.route.js";
import { LinkRepository } from "./modules/link/link.repository.js";
import { LinkService } from "./modules/link/link.service.js";
import { LinkController } from "./modules/link/link.controller.js";

const server = fastify();
const port = 3000;

async function buildServer() {
  // === 1) Registrar CORS ANTES das rotas ===
  // Opção 1: permitir explicitamente só sua origem de dev (recomendado)
  await server.register(cors, {
    origin: ["http://localhost:3001"], // <--- permita aqui a origem do seu front
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Location"], // expõe o header Location se precisar (redirect)
    credentials: true, // se você enviar cookies/credentials
  });

  // // Opção 2: modo permissivo (apenas para DEV)
  // await server.register(cors, { origin: true, credentials: true });

  // === 2) Montagem do módulo de links (após ter registrado CORS) ===
  const linkRepository = new LinkRepository();
  const linkService = new LinkService(linkRepository);
  const linkController = new LinkController(linkService);

  // registra rotas CRUD no prefix /links
  server.register(linkRoutes, { prefix: "/links" });

  // rota global de redirecionamento (/:code)
  server.get("/:code", (request, reply) => linkController.redirect(request, reply));
}

async function start() {
  try {
    await buildServer();
    const address = await server.listen({ port });
    console.log("HTTP server running on", address);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
