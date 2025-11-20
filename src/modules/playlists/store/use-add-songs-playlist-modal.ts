import { create } from "zustand"

interface Store {
  open: boolean
  playlistId: string
  onOpen: (playlistId: string) => void
  onClose: () => void
}

export const useAddSongsPlaylistModal = create<Store>((set) => ({
  open: false,
  playlistId: "",
  onOpen: (playlistId) => set({ open: true, playlistId }),
  onClose: () => set({ open: false, playlistId: "" })
}))
