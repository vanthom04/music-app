import { inferRouterOutputs } from "@trpc/server"

import { type AppRouter } from "@/trpc/routers/_app"

export type SongGetOne = inferRouterOutputs<AppRouter>["songs"]["getOne"]
export type SongGetMany = inferRouterOutputs<AppRouter>["songs"]["getMany"]

export interface LyricsSearch {
  id: string
  trackName: string
  artistName: string
  albumName?: string
  duration: number
  instrumental: boolean
  plainLyrics: string
  syncedLyrics?: string
}
