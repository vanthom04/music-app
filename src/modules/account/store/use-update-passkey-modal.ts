import { create } from "zustand"

interface Store {
  id: string
  open: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

export const useUpdatePasskeyModal = create<Store>((set) => ({
  id: "",
  open: false,
  onOpen: (id: string) => set({ id, open: true }),
  onClose: () => set({ id: "", open: false })
}))
