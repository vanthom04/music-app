import { create } from "zustand"

import { Song } from "@/generated/prisma"

interface Store {
  songs: Song[]
  activeSong: Song | null
  playedSongs: Song[]
  isPlaying: boolean
  isRepeat: boolean
  isRandom: boolean
  currentTime: number
  volume: number
  duration: number
  progress: number
  isDragging: boolean

  // Actions
  setSongs: (songs: Song[]) => void
  setActiveSong: (activeSong: Song) => void
  setPlayedSongs: (playedSongs: Song[]) => void
  setIsPlaying: (isPlaying: boolean) => void
  setTime: (time: number, duration: number) => void
  setVolume: (volume: number) => void
  setProgress: (value: number) => void
  setIsRandom: (isRandom: boolean) => void
  setIsRepeat: (isRepeat: boolean) => void
  setIsDragging: (isDragging: boolean) => void
  playNext: () => void
  playPrev: () => void
  reset: () => void
}

export const usePlayer = create<Store>((set, get) => ({
  songs: [],
  activeSong: null,
  playedSongs: [],
  currentTime: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  duration: 0,
  progress: 0,
  isDragging: false,
  volume: 1,
  setSongs: (songs) => set({ songs }),
  setActiveSong: (activeSong) => set({ activeSong }),
  setPlayedSongs: (playedSongs) => set({ playedSongs }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsRandom: (isRandom) => set({ isRandom }),
  setIsRepeat: (isRepeat) => set({ isRepeat }),
  setVolume: (volume) => set({ volume }),
  setTime: (currentTime, duration) => set({ currentTime, duration }),
  setProgress: (progress) => set({ progress }),
  setIsDragging: (isDragging) => set({ isDragging }),
  playPrev: () => {
    const { songs, activeSong, isRandom } = get()
    if (songs.length === 0) return
    get().setProgress(0)

    if (isRandom) {
      const nextIndex = Math.floor(Math.random() * songs.length)
      get().setActiveSong(songs[nextIndex])
    } else {
      const currentIndex = songs.findIndex((s) => s.id === activeSong?.id)
      const prevSong = songs[currentIndex - 1]

      if (!prevSong) return get().setActiveSong(songs[songs.length - 1])
      get().setActiveSong(prevSong)
    }
  },
  playNext: () => {
    const { songs, activeSong, isRandom } = get()
    if (songs.length === 0) return
    get().setProgress(0)

    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      get().setActiveSong(songs[randomIndex])
    } else {
      const currentIndex = songs.findIndex((s) => s.id === activeSong?.id)
      const nextSong = songs[currentIndex + 1]

      if (!nextSong) return get().setActiveSong(songs[0])
      get().setActiveSong(nextSong)
    }
  },
  reset: () => set({
    songs: [],
    activeSong: null,
    playedSongs: [],
    currentTime: 0,
    duration: 0,
    volume: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
  })
}))
