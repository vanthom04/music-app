import { prisma } from "@/lib/prisma"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { unlikedSchema, addSongSchema, removeSongSchema } from "../schemas"

export const likedRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const likedSongs = await prisma.likedSong.findMany({
      where: {
        userId: ctx.user.id
      },
      orderBy: {
        likedAt: "desc"
      },
      select: {
        song: true
      }
    })

    return likedSongs.map((s) => s.song)
  }),
  getUnliked: protectedProcedure.input(unlikedSchema).query(async ({ input, ctx }) => {
     const items = await prisma.song.findMany({
      where: {
        ...(input.q ? { title: { contains: input.q, mode: "insensitive" } } : {}),
        liked: {
          none: {
            userId: ctx.user.id
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
     })

     return items
  }),
  addSong: protectedProcedure.input(addSongSchema).mutation(async ({ input, ctx }) => {
    const addedSong = await prisma.likedSong.create({
      data: {
        userId: ctx.user.id,
        songId: input.songId
      }
    })

    return addedSong
  }),
  removeSong: protectedProcedure.input(removeSongSchema).mutation(async ({ input, ctx }) => {
    const removedSong = await prisma.likedSong.delete({
      where: {
        userId_songId: {
          userId: ctx.user.id,
          songId: input.songId
        }
      }
    })

    return removedSong
  })
})
