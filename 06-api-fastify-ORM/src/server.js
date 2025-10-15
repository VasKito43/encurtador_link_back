import fastify from "fastify";
import { linkRoutes } from "./modules/link/link.route.js";

const server = fastify();
const port = 3000;

server.register(linkRoutes, { prefix: "/links" });

server.listen({ port }).then((error) => {
  if (error) {
    console.error("Erro ao iniciar o servidor:", error);
    // process.exit(1)
  }
  console.log("HTTP server running on port", port);  
});

