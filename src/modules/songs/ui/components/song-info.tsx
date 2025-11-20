import Image from "next/image"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { Song } from "@/generated/prisma"
import { Button } from "@/components/ui/button"

import { TitleForm } from "../components/title-form"
import { AlbumForm } from "../components/album-form"
import { ArtistForm } from "../components/artist-form"

interface Props {
  song: Song
}

export const SongInfo = ({ song }: Props) => {
  const router = useRouter()

  return (
    <div className="w-1/2 space-y-4">
      <div className="flex items-center gap-x-2">
        <Button size="sm" variant="outline" onClick={router.back}>
          <ArrowLeftIcon />
          Back
        </Button>
        <h3 className="text-lg font-semibold">Song info</h3>
      </div>
      <div className="relative size-[200px] aspect-square rounded-lg overflow-hidden">
        {song.image ? (
          <Image
            fill
            sizes="100%"
            className="object-cover"
            src={`/api/stream/image/${song.image}`}
            alt={song.title}
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
      </div>
      <TitleForm id={song.id} value={song.title} />
      <ArtistForm id={song.id} value={song.artist} />
      <AlbumForm id={song.id} value={song.album} />
    </div>
  )
}
