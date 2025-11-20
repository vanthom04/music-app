import { create } from "zustand"

interface Store {
  open: boolean
  onOpen: () => void
  onClose: () => void
  toggle: () => void
}

export const useShowPlaylist = create<Store>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  toggle: () =>
    set((state) => ({
      open: state.open ? false : true
    }))
}))
