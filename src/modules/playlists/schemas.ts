import { z } from "zod"

export const newPlaylistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional()
})

export const getOneSchema = z.object({
  id: z.string().min(1, "Id is required")
})

export const editPlaylistSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional()
})

export const getAvailableSongsSchema = z.object({
  playlistId: z.string().min(1, "Id is required"),
  q: z.string().optional()
})

export const addSongSchema = z.object({
  playlistId: z.string().min(1, "Id is required"),
  songId: z.string().min(1, "Id is required")
})

export const removeSongSchema = z.object({
  playlistId: z.string().min(1, "Id is required"),
  songId: z.string().min(1, "Id is required")
})
