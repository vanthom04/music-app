import { headers } from "next/headers"
import { TRPCError } from "@trpc/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Passkey } from "@/generated/prisma"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { setPasswordSchema } from "../schemas"

export const accountRouter = createTRPCRouter({
  listPasskeys: protectedProcedure.query(async () => {
    const passkeys = await auth.api.listPasskeys({
      headers: await headers()
    })

    return passkeys as Passkey[]
  }),
  hasPassword: protectedProcedure.query(async ({ ctx }) => {
    const account = await prisma.account.findFirst({
      where: {
        userId: ctx.user.id,
        providerId: "credential"
      },
      select: {
        id: true,
        updatedAt: true
      }
    })

    return account
  }),
  setPassword: protectedProcedure.input(setPasswordSchema).mutation(async ({ input }) => {
    const result = await auth.api.setPassword({
      headers: await headers(),
      body: {
        newPassword: input.password
      }
    })

    return result
  }),
  deleteCurrent: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id
      }
    })

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
    }

    // Delete account
    await prisma.user.delete({
      where: {
        id: user.id
      }
    })

    // Sign out
    await auth.api.signOut({
      headers: await headers()
    })
  })
})
