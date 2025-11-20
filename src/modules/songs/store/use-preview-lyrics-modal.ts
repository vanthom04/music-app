import { create } from "zustand"

interface Lyrics {
  plain: string
  synced?: string
}

interface Store {
  open: boolean
  lyrics: Lyrics
  onOpen: (lyrics: Lyrics) => void
  onClose: () => void
}

export const usePreviewLyricsModal = create<Store>((set) => ({
  open: false,
  lyrics: { plain: "", synced: "" },
  onOpen: (lyrics) => set({ open: true, lyrics }),
  onClose: () => set({ open: false, lyrics: { plain: "", synced: "" } })
}))
