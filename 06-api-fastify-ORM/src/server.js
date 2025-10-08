// src/server.js (exemplo)
import fastify from "fastify";
import { linkRoutes } from "./modules/link/link.route.js";

const server = fastify();
const port = 3000;

server.register(linkRoutes, { prefix: "/links" });

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
