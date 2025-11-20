"use client"

import Image from "next/image"

import { FaPlay } from "react-icons/fa6"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MoreVerticalIcon, PlusCircleIcon } from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { useOnPlay } from "@/hooks/use-on-play"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/error-state"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { SongItem } from "../components/song-item"
import { useAddLikedSongsModal } from "../../store/use-add-liked-songs-modal"

export const LikedView = () => {
  const addLikedSongsModal = useAddLikedSongsModal()
  const trpc = useTRPC()

  const { data: songs } = useSuspenseQuery(trpc.liked.getMany.queryOptions())

  const onPlay = useOnPlay(songs)

  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <div className="flex-1 flex gap-4">
        <div className="w-1/3">
          <div className="shadow-sm rounded-lg p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image fill sizes="100%" src="/images/liked-1024.png" alt="Liked Songs" />
            </div>
            <h3 className="text-2xl font-semibold text-wrap mt-3">Liked songs</h3>
            <p className="text-muted-foreground">{songs.length} songs</p>
            <div className="flex items-center gap-x-4 mt-3">
              <Button
                onClick={() => onPlay(songs[0])}
                className="flex-1 h-9 rounded-full transition-transform duration-300 active:scale-95"
              >
                <FaPlay />
                Play all
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={addLikedSongsModal.onOpen}>
                    <PlusCircleIcon />
                    Add songs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="w-2/3 space-y-1">
          {songs.map((song, index) => (
            <SongItem
              key={song.id}
              index={index}
              id={song.id}
              title={song.title}
              artist={song.artist}
              duration={song.duration}
              image={song.image}
              onClick={() => onPlay(song)}
            />
          ))}
          {songs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Image width={130} height={130} src="/images/empty-state.png" alt="Empty" />
              <p className="text-lg font-medium">You don&apos;t have any songs you like yet</p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={addLikedSongsModal.onOpen}
              >
                <PlusCircleIcon />
                Add songs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const LikedViewLoading = () => {
  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <div className="flex-1 flex gap-4">
        <div className="w-1/3">
          <div className="shadow-sm rounded-lg p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image fill sizes="100%" src="/images/liked-1024.png" alt="Liked Songs" />
            </div>
            <h3 className="text-2xl font-semibold text-wrap mt-3">Liked songs</h3>
            <Skeleton className="w-[100px] h-7" />
            <div className="flex items-center gap-x-4 mt-3">
              <Button className="flex-1 h-9 rounded-full">
                <FaPlay />
                Play all
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <MoreVerticalIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-2/3 space-y-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={`loading-${index}`} className="flex-1 py-6.5" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const LikedViewError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
