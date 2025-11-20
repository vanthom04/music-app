export type LocalSongItem = {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  lyrics?: string
  image: File | Blob | null
  audio: File
  imagePreview?: string
  audioPreview: string
}
