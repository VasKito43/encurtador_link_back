// server.js
import fastify from "fastify";
import cors from "@fastify/cors";
import { linkRoutes } from "./modules/link/link.route.js";
import { LinkRepository } from "./modules/link/link.repository.js";
import { LinkService } from "./modules/link/link.service.js";
import { LinkController } from "./modules/link/link.controller.js";

const server = fastify({
  logger: true, 
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = "0.0.0.0"; 

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : true;

async function buildServer() {
  await server.register(cors, {
    origin: corsOrigin,
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
    const address = await server.listen({ port, host });
    console.log("HTTP server running on", address);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
