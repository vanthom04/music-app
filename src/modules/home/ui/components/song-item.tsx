import Image from "next/image"

import { FaPlay } from "react-icons/fa6"
import { ClockIcon } from "lucide-react"

import { formatTime } from "@/lib/utils"

interface Props {
  id: string
  title: string
  artist: string
  image?: string | null
  duration: number
  onClick: () => void
}

export const SongItem = ({ title, artist, duration, image, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="rounded-md p-2.5 hover:bg-neutral-300/20 cursor-pointer group"
    >
      <div className="w-full aspect-square relative rounded-md overflow-hidden">
        {image ? (
          <Image
            fill
            sizes="100%"
            className="object-cover"
            src={`/api/stream/image/${image}`}
            alt={title}
            onLoad={() => {
              console.info("loaded image")
            }}
          />
        ) : (
          <div className="size-full flex items-center justify-center border rounded-md bg-slate-100">
            <Image
              width={46}
              height={46}
              className="object-cover"
              src="/images/no-image.png"
              alt="No image"
            />
          </div>
        )}
        <button
          type="button"
          className="absolute right-2 -bottom-2 group-hover:bottom-2 size-[48px] flex items-center justify-center rounded-full bg-primary transition-all hover:bg-primary/90 hover:scale-105 opacity-0 group-hover:opacity-100"
        >
          <FaPlay className="size-5 text-white" />
        </button>
      </div>
      <div className="flex flex-col mt-2">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-[13px] text-muted-foreground truncate">{artist}</p>
        <p className="text-[13px] text-muted-foreground truncate flex items-center gap-x-1">
          <ClockIcon className="size-[13px] text-muted-foreground" />
          {formatTime(duration)}
        </p>
      </div>
    </div>
  )
}
