import superjson from "superjson"

import { cache } from "react"
import { ZodError } from "zod"
import { headers } from "next/headers"
import { initTRPC, TRPCError } from "@trpc/server"

import { auth } from "@/lib/auth"

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return { session }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Avoid exporting the entire t-object since it's not very descriptive.
// For instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    const isInputValidationError = error.code === "BAD_REQUEST" && error.cause instanceof ZodError

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: isInputValidationError ? error.cause.flatten() : null
      }
    }
  }
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user
    }
  })
})
