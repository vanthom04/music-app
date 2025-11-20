import Image from "next/image"

import { toast } from "sonner"
// import { IoHeartOutline } from "react-icons/io5"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClockIcon, DownloadIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { extractFirstZodMessage, formatTime, downloadSong } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Props {
  id: string
  index: number
  title: string
  artist: string
  duration: number
  playlistId: string
  image?: string | null
  onClick: () => void
}

export const SongItem = ({
  id,
  index,
  title,
  artist,
  duration,
  image,
  playlistId,
  onClick
}: Props) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const removeSong = useMutation(trpc.playlists.removeSong.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.playlists.getOne.queryOptions({ id: playlistId }))
      await queryClient.invalidateQueries(trpc.playlists.getAvailableSongs.queryOptions({
        playlistId
      }))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  return (
    <div className="flex items-center py-2 rounded-md bg-gray-100 cursor-pointer">
      <div className="size-9 flex items-center justify-center text-[13px] font-medium">
        {index + 1}
      </div>
      <div className="flex items-center gap-x-2 flex-1" onClick={onClick}>
        <div className="size-[40px] relative aspect-square rounded-md overflow-hidden">
          {image ? (
            <Image
              fill
              sizes="100%"
              className="object-cover"
              src={`/api/stream/image/${image}`}
              alt={title}
            />
          ): (
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
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-1">{title}</p>
          <p className="text-[13px] text-muted-foreground line-clamp-1">{artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-4 pl-3">
        <div className="flex flex-col items-center gap-y-0.5">
          <ClockIcon className="size-3.5 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">{formatTime(duration)}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="hover:bg-transparent">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem onClick={() => removeSong.mutate({ playlistId, songId: id })}>
              <TrashIcon />
              Remove
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadSong(id)}>
              <DownloadIcon />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
