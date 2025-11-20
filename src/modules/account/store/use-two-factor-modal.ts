import { create } from "zustand"

interface Store {
  open: boolean
  twoFactorEnable: boolean
  onOpen: (twoFactorEnable: boolean) => void
  onClose: () => void
}

export const useTwoFactorModal = create<Store>((set) => ({
  open: false,
  twoFactorEnable: false,
  onOpen: (twoFactorEnable) => set({ twoFactorEnable, open: true }),
  onClose: () => set({ open: false })
}))
