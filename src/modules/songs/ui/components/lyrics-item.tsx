import { toast } from "sonner"
import { EyeIcon, LoaderIcon, PlusCircleIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractFirstZodMessage, formatTime } from "@/lib/utils"

interface Props {
  title: string
  artist: string
  duration: number
  plainText: string
  syncedText?: string
  songId: string
  onClose: () => void
  onShowPreview: () => void
}

export const LyricsItem = ({
  title,
  artist,
  duration,
  plainText,
  syncedText,
  songId,
  onClose,
  onShowPreview
}: Props) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const upsertLyrics = useMutation(trpc.lyrics.upsert.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.songs.getLyrics.queryOptions({ songId }))
      onClose()
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  return (
    <div className="flex items-center gap-x-2 px-3 py-2 bg-slate-100 shadow-xs rounded-md">
      <div className="flex-1">
        <p className="text-[15px] font-medium line-clamp-1">{title}</p>
        <p className="text-sm line-clamp-1">{artist}</p>
        <div className="flex items-center gap-x-2 mt-2">
          <Badge variant="outline" className="text-primary">
            {formatTime(duration)}
          </Badge>
          {syncedText ? (
            <Badge>Synced</Badge>
          ) : (
            <Badge className="bg-neutral-800">Plain</Badge>
          )}
        </div>
      </div>
      <Button size="icon" variant="outline" onClick={onShowPreview}>
        <EyeIcon />
      </Button>
      <Button
        className="min-w-20"
        disabled={upsertLyrics.isPending}
        onClick={() => upsertLyrics.mutate({ songId, plainText, syncedText })}
      >
        {upsertLyrics.isPending ? (
          <LoaderIcon className="text-white animate-spin" />
        ) : (
          <>
            <PlusCircleIcon />
            Add
          </>
        )}
      </Button>
    </div>
  )
}
