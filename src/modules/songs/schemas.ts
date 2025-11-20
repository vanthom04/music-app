import { z } from "zod"

import { URL_REGEX } from "@/constants"

export const getOneSchema = z.object({
  id: z.string().min(1, "Id is required")
})

export const deleteOneSchema = z.object({
  id: z.string().min(1, "Id is required")
})

export const deleteManySchema = z.object({
  ids: z.array(z.string())
})

export const updateSongSchema = z.object({
  id: z.string().min(1, "Id is required"),
  title: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().nullish(),
  image: z
    .object({
      mime: z.string(),
      data: z.string().min(1, "Image is required")
    })
    .nullish()
})

export const newestSchema = z.object({
  cursor: z.string().nullish()
})

export const probeUrlSchema = z.object({
  url: z.string().min(1, "URL is required").regex(URL_REGEX, "URL Invalid")
})

export const getManySongsSchema = z.object({
  q: z.string().optional()
})

export const loadSongsSchema = z.object({
  ids: z.array(z.string()).min(1)
})

export const getLyricsSchema = z.object({
  songId: z.string().min(1, "Song ID is required")
})
