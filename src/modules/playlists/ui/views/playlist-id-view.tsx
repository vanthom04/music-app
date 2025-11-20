"use client"

import Image from "next/image"

import { toast } from "sonner"
import { FaPlay } from "react-icons/fa6"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { EditIcon, MoreVerticalIcon, PlusCircleIcon, Trash2Icon } from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { useOnPlay } from "@/hooks/use-on-play"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { Skeleton } from "@/components/ui/skeleton"
import { extractFirstZodMessage } from "@/lib/utils"
import { ErrorState } from "@/components/error-state"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { SongItem } from "../components/song-item"
import { useEditPlaylistModal } from "../../store/use-edit-playlist-modal"
import { useAddSongsPlaylistModal } from "../../store/use-add-songs-playlist-modal"

interface Props {
  id: string
}

export const PlaylistIdView = ({ id }: Props) => {
  const editPlaylistModal = useEditPlaylistModal()
  const addSongsPlaylistModal = useAddSongsPlaylistModal()
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.playlists.getOne.queryOptions({ id }))

  const onPlay = useOnPlay(data.songs)

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm({
    title: "Are you sure?",
    message: "This action cannot be undone."
  })

  const deletePlaylist = useMutation(trpc.playlists.deleteOne.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.playlists.getMany.queryOptions())
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const onDeletePlaylist = async () => {
    const ok = await confirmDelete()

    if (ok) {
      deletePlaylist.mutate({ id })
    }
  }

  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <ConfirmDeleteDialog />
      <div className="flex-1 flex gap-4">
        <div className="w-1/3">
          <div className="shadow-sm rounded-lg p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              {data.thumbnailUrl ? (
                <Image
                  fill
                  sizes="100%"
                  className="object-cover"
                  src={data.thumbnailUrl}
                  alt={data.title}
                />
              ) : (
                <div className="size-full flex items-center justify-center border rounded-lg bg-slate-100">
                  <Image
                    width={64}
                    height={64}
                    className="object-cover"
                    src="/images/no-image.png"
                    alt="No image"
                  />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-semibold text-wrap mt-3">{data.title}</h3>
            <p className="text-muted-foreground">
              {data.description || "No description"}
            </p>
            <p className="text-muted-foreground">
              {data.totalSongs} {data.totalSongs === 1 ? "song" : "songs"}
            </p>
            <div className="flex items-center gap-x-4 mt-3">
              <Button
                onClick={() => onPlay(data.songs[0])}
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
                  <DropdownMenuItem onClick={() => addSongsPlaylistModal.onOpen(id)}>
                    <PlusCircleIcon />
                    Add songs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editPlaylistModal.onOpen(id)}>
                    <EditIcon />
                    Edit playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:!text-rose-500" onClick={onDeletePlaylist}>
                    <Trash2Icon />
                    Delete playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="w-2/3 space-y-1">
          {data.songs.map((song, index) => (
            <SongItem
              key={song.id}
              index={index}
              id={song.id}
              playlistId={id}
              title={song.title}
              artist={song.artist}
              duration={song.duration}
              image={song.image}
              onClick={() => onPlay(song)}
            />
          ))}
          {data.songs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Image width={130} height={130} src="/images/empty-state.png" alt="Empty" />
              <p className="text-lg font-medium">You don&apos;t have any songs you like yet</p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => addSongsPlaylistModal.onOpen(id)}
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

export const PlaylistIdViewLoading = () => {
  return (
    <div className="h-full px-4 py-3 overflow-y-auto">
      <div className="flex-1 flex gap-4">
        <div className="w-1/3">
          <div className="shadow-sm rounded-lg p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Skeleton className="size-full" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-9 w-full" />
            <div className="flex items-center gap-x-4 mt-3">
              <Skeleton className="flex-1 h-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
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

export const PlaylistIdViewError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
