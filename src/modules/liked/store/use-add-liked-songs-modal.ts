import { create } from "zustand"

interface Store {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

export const useAddLikedSongsModal = create<Store>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false })
}))
