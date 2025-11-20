import { Song } from "@/generated/prisma"

import { usePlayer } from "./use-player"

export const useOnPlay = (songs: Song[]) => {
  const player = usePlayer()

  const onPlay = (song: Song) => {
    player.setSongs(songs)
    player.setActiveSong(song)
  }

  return onPlay
}
