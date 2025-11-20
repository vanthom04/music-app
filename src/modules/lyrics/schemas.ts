import { z } from "zod"

export const upsertLyricsSchema = z.object({
  songId: z.string().min(1, "Id is required"),
  plainText: z.string().min(1, "Plain text is required"),
  syncedText: z.string().nullish(),
})
