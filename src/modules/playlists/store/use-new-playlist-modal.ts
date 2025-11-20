import { create } from "zustand"

interface Store {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewPlaylistModal = create<Store>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false })
}))
