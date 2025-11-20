import Image from "next/image"

import { FaPlay } from "react-icons/fa6"
import { useRouter } from "next/navigation"

interface Props {
  id: string
  title: string
  description?: string | null
  image?: string | null
  totalSongs: number
}

export const PlaylistItem = ({ id, title, totalSongs, description, image }: Props) => {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/playlists/${id}`)}
      className="rounded-lg hover:bg-neutral-300/30 p-2.5 cursor-pointer group"
    >
      <div className="relative aspect-square rounded-md overflow-hidden">
        {image ? (
          <Image fill sizes="100%" className="object-cover" src={image} alt={title} />
        ) : (
          <div className="size-full flex items-center justify-center border rounded-md bg-slate-100">
            <Image
              width={48}
              height={48}
              className="object-cover"
              src="/images/no-image.png"
              alt="No image"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => {}}
          className="absolute right-2 -bottom-2 group-hover:bottom-2 size-[48px] flex items-center justify-center rounded-full bg-primary transition-all hover:bg-primary/90 hover:scale-105 opacity-0 group-hover:opacity-100"
        >
          <FaPlay className="size-5 text-white" />
        </button>
      </div>
      <div className="mt-2">
        <p className="text-base font-semibold truncate">{title}</p>
        <p className="text-[13px] text-muted-foreground truncate">
          {description || "No description"}
        </p>
        <p className="text-[12.5px] text-muted-foreground truncate">
          {totalSongs} {totalSongs === 1 ? "song" : "songs"}
        </p>
      </div>
    </div>
  )
}
