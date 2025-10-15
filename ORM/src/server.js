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
  await server.register(cors, {
    origin: ["http://localhost:3001"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Location"], 
    credentials: true, 
  });


  
  const linkRepository = new LinkRepository();
  const linkService = new LinkService(linkRepository);
  const linkController = new LinkController(linkService);

 
  server.register(linkRoutes, { prefix: "/links" });

  
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
