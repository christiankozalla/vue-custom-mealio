import Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";

import { PrismaClient, User, Slot } from "@prisma/client";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

export const userPlugin: Hapi.Plugin<null> = {
  name: "users",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "GET",
        path: "/user",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          return h.response("Please provide an ID to get a user");
        },
      },
      {
        method: "GET",
        path: "/user/{userId}",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;
          const userId = parseInt(request.params.userId, 10);

          const user: User | null = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          });

          if (!user) {
            return Boom.notFound();
          }

          return h.response(user);
        },
      },
      {
        method: "POST",
        path: "/user",
        options: {
          payload: {
            parse: true,
          },
        },
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;

          const body = request.payload as Partial<User>;

          if (!body.name) return Boom.badData();

          const newUser = await prisma.user.create({
            data: {
              name: body.name,
            },
          });

          // Only if user.name must be unique..
          // if (!newUser) {
          //   return Boom.badData("Name already exists");
          // }

          return h.response(newUser);
        },
      },
      {
        method: "GET",
        path: "/user/{userId}/slots",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;
          const userId = parseInt(request.params.userId, 10);

          let userAndSlots = await prisma.user.findUnique({
            where: {
              id: userId,
            },
            include: {
              slots: true,
            },
          });

          if (userAndSlots) return h.response(userAndSlots);
          else return Boom.notFound();
        },
      },
      {
        method: "PUT",
        path: "/user/{userId}/slots",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;
          const userId = parseInt(request.params.userId, 10);
          const slot = request.payload as Slot;

          let updatedSlot = await prisma.slot.update({
            where: {
              id: slot.id,
            },
            data: slot,
          });

          return h.response(updatedSlot);
        },
      },
      {
        method: "POST",
        path: "/user/{userId}/slots",
        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;
          const userId = parseInt(request.params.userId, 10);

          // const user = await prisma.user.findUnique({
          //   where: {
          //     id: userId,
          //   },
          // });

          let newSlot = await prisma.slot.create({
            data: {
              userId,
            },
          });

          return h.response(newSlot);
        },
      },
    ]);
  },
};
