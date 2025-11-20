import Image from "next/image"

import { ClockIcon, DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { downloadSong, formatTime } from "@/lib/utils"

interface Props {
  id: string
  title: string
  artist: string
  duration: number
  image?: string | null
  onClick: () => void
}

export const SongItem = ({ id, title, artist, image, duration, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-2 shadow-xs rounded-md bg-slate-50"
    >
      <div className="flex items-center gap-x-2 flex-1">
        <div className="size-[40px] relative aspect-square rounded-md overflow-hidden">
          <Image
            fill
            sizes="100%"
            className="object-cover"
            src={`/api/stream/image/${image}`}
            alt={title}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-1">{title}</p>
          <p className="text-[13px] text-muted-foreground line-clamp-1">{artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="flex flex-col items-center gap-y-0.5">
          <ClockIcon className="size-3 text-muted-foreground" />
          <span className="text-[12px] text-muted-foreground">{formatTime(duration)}</span>
        </div>
        <Button
          variant="ghost"
          className="size-8"
          onClick={(e) => {
            e.stopPropagation()
            downloadSong(id)
          }}
        >
          <DownloadIcon />
        </Button>
      </div>
    </div>
  )
}
