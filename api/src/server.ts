import Hapi from "@hapi/hapi";

import { prismaPlugin } from "./plugins/prisma";

// Routes
import { userPlugin } from "./plugins/user";

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 4000,
  host: process.env.HOST || "0.0.0.0",
  debug: {
    log: ["info"],
    request: ["error"],
  },
  routes: {
    cors: {
      origin: ["Access-Control-Allow-Origin", "http://localhost:3000"],
    },
  },
});

export async function createServer(): Promise<Hapi.Server> {
  // Register Hapi plugins -- like middleware

  await server.register([prismaPlugin, userPlugin]);

  server.route([
    {
      method: "GET",
      path: "/",
      handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        return h.response({ message: "Hello from Hapi Backend" }).code(200);
      },
    },
  ]);

  await server.initialize();

  return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start();
  server.log("info", `Server running on ${server.info.uri}`);
  return server;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
