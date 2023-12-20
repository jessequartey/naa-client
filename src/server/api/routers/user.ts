import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    }),

  addPhone: protectedProcedure
    .input(
      z.object({
        phone: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: {
          id: ctx.session.user.id, // get the user id from the session
        },
        data: {
          name: input.phone,
          email: input.address,
        },
      });
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id, // get the user id from the session
      },
    });
  }),
});
