import { z } from "zod"

export const unlikedSchema = z.object({
  q: z.string().optional()
})

export const addSongSchema = z.object({
  songId: z.string().min(1, "Id is required")
})

export const removeSongSchema = z.object({
  songId: z.string().min(1, "Id is required")
})
