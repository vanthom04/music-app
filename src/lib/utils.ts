import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractFirstZodMessage = (error: any) => {
  const z = error?.data?.zodError

  if (!z) return null

  const msgs = [...Object.values(z.fieldErrors).flat(), ...(z.formErrors ?? [])]
  return msgs.find(Boolean) ?? null
}

export const formatTime = (time: number) => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export const downloadSong = (songId: string) => {
  const link = document.createElement("a")
  link.href = `/api/song/download?songId=${songId}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
