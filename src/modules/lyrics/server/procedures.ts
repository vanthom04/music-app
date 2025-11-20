import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { upsertLyricsSchema } from "../schemas"
import { prisma } from "@/lib/prisma"

export const lyricsRouter = createTRPCRouter({
  upsert: protectedProcedure.input(upsertLyricsSchema).mutation(async ({ input }) => {
    const upsertedLyrics = await prisma.lyrics.upsert({
      where: {
        songId: input.songId
      },
      create: {
        songId: input.songId,
        text: input.plainText,
        syncText: input.syncedText
      },
      update: {
        text: input.plainText,
        syncText: input.syncedText
      }
    })

    return upsertedLyrics
  })
})
