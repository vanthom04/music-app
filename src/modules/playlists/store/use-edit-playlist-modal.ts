import { create } from "zustand"

interface Store {
  id: string
  open: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

export const useEditPlaylistModal = create<Store>((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" })
}))
