"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { useOnPlay } from "@/hooks/use-on-play"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/error-state"

import { SongItem } from "../components/song-item"

interface Props {
  q: string
}

export const SearchView = ({ q }: Props) => {
  const trpc = useTRPC()

  const { data: songs } = useSuspenseQuery(trpc.songs.getMany.queryOptions({ q }))

  const onPlay = useOnPlay(songs)

  return (
    <div className="h-full px-4 py-3 space-y-4 overflow-y-auto">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          id={song.id}
          title={song.title}
          artist={song.artist}
          image={song.image}
          duration={song.duration}
          onClick={() => onPlay(song)}
        />
      ))}
      {songs.length === 0 && (
        <div className="w-full flex items-center justify-center p-10">
          <p className="text-[15px] text-muted-foreground font-medium">
            Songs not found
          </p>
        </div>
      )}
    </div>
  )
}

export const SearchViewLoading = () => {
  return (
    <div className="h-full px-4 py-3 space-y-4 overflow-y-auto">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton
          key={`loading-${index}`}
          className="flex-1 h-12 rounded-md shadow-xs"
        />
      ))}
    </div>
  )
}

export const SearchViewError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
