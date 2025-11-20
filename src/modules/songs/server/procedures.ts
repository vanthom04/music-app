import { TRPCError } from "@trpc/server"
import { parseStream } from "music-metadata"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { prisma } from "@/lib/prisma"
import { deleteMegaNodesSafely, ensureTargetFolder } from "@/lib/mega"

import {
  newestSchema,
  getOneSchema,
  deleteOneSchema,
  updateSongSchema,
  deleteManySchema,
  probeUrlSchema,
  getManySongsSchema,
  loadSongsSchema,
  getLyricsSchema
} from "../schemas"

const NEWEST_LIMIT = 10

export const songsRouter = createTRPCRouter({
  newest: protectedProcedure.input(newestSchema).query(async ({ input, ctx }) => {
    const items = await prisma.song.findMany({
      where: {
        userId: ctx.user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: NEWEST_LIMIT,
      ...(input.cursor ? {
        cursor: {
          id: input.cursor
        },
        skip: 1
      } : {})
    })

    let nextCursor = null
    if (items.length === NEWEST_LIMIT) {
      nextCursor = items[NEWEST_LIMIT - 1].id
    }

    return { items, nextCursor }
  }),
  getOne: protectedProcedure.input(getOneSchema).query(async ({ input, ctx }) => {
    const song = await prisma.song.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      }
    })

    if (!song) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Song not found" })
    }

    return song
  }),
  getMany: protectedProcedure.input(getManySongsSchema).query(async ({ input, ctx }) => {
    const songs = await prisma.song.findMany({
      where: {
        userId: ctx.user.id,
        ...(input.q ? {
          OR: [
            { title: { contains: input.q, mode: "insensitive" } },
            { artist: { contains: input.q, mode: "insensitive" } },
            { album: { contains: input.q, mode: "insensitive" } }
          ]
        } : {})
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return songs
  }),
  updateSong: protectedProcedure.input(updateSongSchema).mutation(async ({ input, ctx }) => {
    const imagesFolder = await ensureTargetFolder("images")

    const song = await prisma.song.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      }
    })

    if (!song) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Song not found" })
    }

    if (input.image) {
      // Delete song image
      if (song.image) {
        await deleteMegaNodesSafely([song.image])
      }

      // Upload song image
      const imageB64 = input.image.data.split("base64,")[1]
      const imageBuffer = Buffer.from(imageB64, "base64")
      const filename = `${song.title}-${Date.now()}.${input.image.mime.split("/").pop()}`

      const imageUploader = await imagesFolder.upload(
        { name: filename, size: imageBuffer.length },
        imageBuffer
      ).complete

      // Save nodeId image
      await prisma.song.update({
        where: {
          id: song.id,
          userId: ctx.user.id
        },
        data: {
          image: imageUploader.nodeId
        }
      })
    }

    // Update song
    await prisma.song.update({
      where: {
        id: song.id,
        userId: ctx.user.id
      },
      data: {
        title: input.title,
        artist: input.artist,
        album: input.album
      }
    })

    return { success: true, message: "Updated song successfully" }
  }),
  deleteOne: protectedProcedure.input(deleteOneSchema).mutation(async ({ input, ctx }) => {
    const song = await prisma.song.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id
      }
    })

    if (!song) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Song not found" })
    }

    // Delete image and audio
    await deleteMegaNodesSafely([song.image, song.audio].filter(Boolean) as string[])

    // Delete song data
    await prisma.song.delete({
      where: {
        id: song.id,
        userId: ctx.user.id
      }
    })

    // TODO: LOGIC DELETE ONE SONG
    return { success: true, message: "Deleted song successfully" }
  }),
  deleteMany: protectedProcedure.input(deleteManySchema).mutation(async ({ input, ctx }) => {
    const songs = await prisma.song.findMany({
      where: {
        id: {
          in: input.ids
        },
        userId: ctx.user.id
      }
    })

    if (!songs.length) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No valid song found" })
    }

    const validIds = songs.map((s) => s.id)
    const audioIds = songs.map((s) => s.audio)
    const imageIds = songs.map((s) => s.image).filter(Boolean) as string[]

    // Delete many images
    await deleteMegaNodesSafely(imageIds)

    // Delete many audios
    await deleteMegaNodesSafely(audioIds)

    // Delete many songs data
    const result = await prisma.song.deleteMany({
      where: {
        id: {
          in: validIds
        },
        userId: ctx.user.id
      }
    })

    return {
      success: true,
      count: result.count,
      message: "Deleted songs successfully"
    }
  }),
  loadSongs: protectedProcedure.input(loadSongsSchema).query(async ({ input, ctx }) => {
    const songs = await prisma.song.findMany({
      where: {
        id: {
          in: input.ids
        },
        userId: ctx.user.id
      },
      select: {
        id: true,
        title: true,
        artist: true,
        image: true,
        duration: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return songs
  }),
  getLyrics: protectedProcedure.input(getLyricsSchema).query(async ({ input }) => {
    const lyrics = await prisma.lyrics.findUnique({
      where: {
        songId: input.songId
      },
      select: {
        id: true,
        text: true,
        syncText: true
      }
    })

    return lyrics
  }),
  probeUrlForMetadata: protectedProcedure.input(probeUrlSchema).mutation(async ({ input }) => {
    const headSize = 128 * 1024 // 128KB
    const res = await fetch(input.url, {
      headers: { Range: `bytes=0-${headSize - 1}` }
    })

    if (!res.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Fetch failed - ${res.statusText}`
      })
    }
    if (!res.body) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No response body" })
    }

    const mime = res.headers.get("content-type") || "audio/mpeg"

    // Web ReadableStream -> Node stream
    const { Readable } = await import("node:stream")
    const metaReadable = Readable.fromWeb(res.body as any)

    const { common, format } = await parseStream(metaReadable, { mimeType: mime })

    const pic = common.picture?.[0]
    let image: { mime: string; data: string } | null = null

    if (pic?.data) {
      const mimeType = pic.format || "image/jpeg"
      const buf = Buffer.from(pic.data as Uint8Array)
      const b64 = buf.toString("base64")
      image = {
        mime: mimeType,
        data: `data:${mimeType};base64,${b64}`
      }
    }

    return {
      title: common.title || "Unknown Title",
      artist: common.artist || "Unknown Artist",
      album: common.album || "Unknown Album",
      duration: format.duration || 0,
      lyrics: common.lyrics?.[0]?.text,
      image
    }
  })
})
