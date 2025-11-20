import { createTRPCRouter } from "@/trpc/init"

import { songsRouter } from "@/modules/songs/server/procedures"
import { likedRouter } from "@/modules/liked/server/procedures"
import { lyricsRouter } from "@/modules/lyrics/server/procedures"
import { accountRouter } from "@/modules/account/server/procedures"
import { playlistsRouter } from "@/modules/playlists/server/procedures"

export const appRouter = createTRPCRouter({
  account: accountRouter,
  songs: songsRouter,
  playlists: playlistsRouter,
  liked: likedRouter,
  lyrics: lyricsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
