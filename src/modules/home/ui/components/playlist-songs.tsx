"use client"

import Image from "next/image"

import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { usePlayer } from "@/hooks/use-player"
import { Button } from "@/components/ui/button"

import { useShowPlaylist } from "../../store/use-show-playlist"

export const PlaylistSongs = () => {
  const { open, onClose } = useShowPlaylist()

  const player = usePlayer() // loadSongs

  return (
    <div
      className={cn(
        "absolute top-0 bottom-[5rem] -right-[350px] bg-background border-l p-4 w-1/4 opacity-0 transition-all duration-300 z-[50]",
        open && "right-0 opacity-100"
      )}
    >
      <div className="items-center justify-between flex">
        <h4 className="text-xl font-semibold">Playlist</h4>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <XIcon />
        </Button>
      </div>
      <div className="space-y-2 h-[calc(100%-50px)] overflow-y-auto mt-3">
        {player.songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => player.setActiveSong(song)}
            className="flex items-center py-2 pr-2 rounded-md cursor-pointer bg-slate-100 shadow-xs"
          >
            <div className="size-[30px] flex items-center justify-center">
              <span className="text-xs font-medium">{index + 1}</span>
            </div>
            <div className="flex-1 flex items-center gap-x-2">
              <div className="relative size-[35px] rounded-[3px] overflow-hidden">
                <Image
                  fill
                  sizes="100%"
                  className="object-cover"
                  src={`/api/stream/image/${song.image}`}
                  alt={song.title}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{song.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
