import { TRPCError } from "@trpc/server"

import { prisma } from "@/lib/prisma"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import {
  getOneSchema,
  newPlaylistSchema,
  editPlaylistSchema,
  getAvailableSongsSchema,
  addSongSchema,
  removeSongSchema
} from "../schemas"
import { deleteOneSchema } from "@/modules/songs/schemas"
import { UTApi } from "uploadthing/server"

export const playlistsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(getOneSchema).query(async ({ input, ctx }) => {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        songs: {
          include: {
            song: true
          }
        },
        thumbnailUrl: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
    }

    const totalSongs = await prisma.playlistSong.count({
      where: {
        playlistId: playlist.id
      }
    })

    return {
      ...playlist,
      songs: playlist.songs.map((s) => s.song),
      totalSongs
    }
  }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: ctx.user.id
      },
      orderBy: {
        updatedAt: "desc"
      }
    })

    const results = await Promise.all(
      playlists.map(async (playlist) => {
        const totalSongs = await prisma.playlistSong.count({
          where: {
            playlistId: playlist.id
          }
        })

        return { ...playlist, totalSongs }
      })
    )

    return results
  }),
  create: protectedProcedure.input(newPlaylistSchema).mutation(async ({ input, ctx }) => {
    const playlist = await prisma.playlist.create({
      data: {
        ...input,
        userId: ctx.user.id
      }
    })

    return playlist
  }),
  updateOne: protectedProcedure.input(editPlaylistSchema).mutation(async ({ input, ctx }) => {
    const utApi = new UTApi()

    const playlist = await prisma.playlist.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      },
      select: {
        id: true,
        thumbnailUrl: true
      }
    })

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
    }

    if (input.image && playlist.thumbnailUrl?.includes("9b2fomoly8.ufs.sh")) {
      await utApi.deleteFiles(playlist.thumbnailUrl.split("/").pop() ?? "")
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: playlist.id,
        userId: ctx.user.id
      },
      data: {
        title: input.title,
        description: input.description,
        thumbnailUrl: input.image
      }
    })

    return updatedPlaylist
  }),
  deleteOne: protectedProcedure.input(deleteOneSchema).mutation(async ({ input, ctx }) => {
    const utApi = new UTApi()

    const playlist = await prisma.playlist.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      },
      select: {
        id: true,
        thumbnailUrl: true
      }
    })

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
    }

    // delete image
    if (playlist.thumbnailUrl?.includes("9b2fomoly8.ufs.sh")) {
      await utApi.deleteFiles(playlist.thumbnailUrl.split("/").pop() ?? "")
    }

    // delete playlist
    await prisma.playlist.delete({
      where: {
        id: playlist.id,
        userId: ctx.user.id
      }
    })

    return { success: "OK" }
  }),
  getAvailableSongs: protectedProcedure
    .input(getAvailableSongsSchema)
    .query(async ({ input, ctx }) => {
      const playlist = await prisma.playlist.findFirst({
        where: {
          id: input.playlistId,
          userId: ctx.user.id
        },
        select: { id: true }
      })

      if (!playlist) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
      }

      const existing = await prisma.playlistSong.findMany({
        where: {
          playlistId: input.playlistId
        },
        select: {
          songId: true
        }
      })

      const existedIds = existing.map((x) => x.songId)

      const items = await prisma.song.findMany({
        where: {
          userId: ctx.user.id,
          id: existedIds.length ? { notIn: existedIds } : undefined,
          ...(input.q
            ? {
                OR: [
                  { title: { contains: input.q, mode: "insensitive" } },
                  { artist: { contains: input.q, mode: "insensitive" } },
                  { album: { contains: input.q, mode: "insensitive" } }
                ]
              }
            : {})
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return items
    }),
  addSong: protectedProcedure.input(addSongSchema).mutation(async ({ input, ctx }) => {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: input.playlistId,
        userId: ctx.user.id
      },
      select: {
        id: true
      }
    })

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
    }

    const song = await prisma.song.findFirst({
      where: {
        id: input.songId,
        userId: ctx.user.id
      },
      select: {
        id: true
      }
    })

    if (!song) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Song not found" })
    }

    const created = await prisma.playlistSong.create({
      data: {
        playlistId: playlist.id,
        songId: song.id
      }
    })

    await prisma.playlist.update({
      where: {
        id: playlist.id
      },
      data: {
        updatedAt: new Date()
      }
    })

    return created
  }),
  removeSong: protectedProcedure.input(removeSongSchema).mutation(async ({ input, ctx }) => {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: input.playlistId,
        userId: ctx.user.id
      },
      select: {
        id: true
      }
    })

    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" })
    }

    const deleted = await prisma.playlistSong.deleteMany({
      where: {
        playlistId: playlist.id,
        songId: input.songId
      }
    })

    if (deleted.count === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Song is not in this playlist" })
    }

    await prisma.playlist.update({
      where: {
        id: playlist.id
      },
      data: {
        updatedAt: new Date()
      }
    })

    return { success: "OK" }
  })
})
