import { create } from "zustand"

interface Store {
  open: boolean
  songId: string
  onOpen: (songId: string) => void
  onClose: () => void
}

export const useUpdateSongLyricsModal = create<Store>((set) => ({
  open: false,
  songId: "",
  onOpen: (songId) => set({ open: true, songId }),
  onClose: () => set({ open: false, songId: "" })
}))

