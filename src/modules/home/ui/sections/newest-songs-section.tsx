import Link from "next/link"
import Image from "next/image"

import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Song } from "@/generated/prisma"
import { useOnPlay } from "@/hooks/use-on-play"
import { Button } from "@/components/ui/button"

import { SongItem } from "../components/song-item"

interface Props {
  songs: Song[]
  isLoading: boolean
  hasNextPage: boolean
  onFetchNextPage: () => void
}

export const NewestSongsSection = ({ songs, isLoading, hasNextPage, onFetchNextPage }: Props) => {
  const onPlay = useOnPlay(songs)

  return (
    <div className="mt-4">
      <h4 className="text-xl font-semibold">Newest songs</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-2">
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
          <div className="col-span-full flex items-center justify-center flex-col">
            <Image
              width={160}
              height={160}
              sizes="100%"
              className="object-cover"
              src="/images/songs-not-found.png"
              alt="Songs not found"
            />
            <p className="text-lg font-semibold tracking-wide mt-2">No latest songs</p>
            <p className="text-sm lg:text-[15px] text-muted-foreground mt-0.5">
              Click the button below to upload your song.
            </p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/upload">
                Upload songs
              </Link>
            </Button>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <LoaderIcon className="size-5 text-muted-foreground animate-spin" />
        </div>
      )}
      {hasNextPage && songs.length > 0 && (
        <div className="flex items-center justify-center mt-4">
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading || !hasNextPage}
            className={cn("bg-accent text-accent-foreground", isLoading && hasNextPage && "hidden")}
            onClick={onFetchNextPage}
          >
            Show more
          </Button>
        </div>
      )}
    </div>
  )
}
