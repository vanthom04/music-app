import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DownloadIcon, EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react"

import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { extractFirstZodMessage } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu"

interface Props {
  id: string
}

export const Actions = ({ id }: Props) => {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action cannot be undone."
  })

  const deleteMutation = useMutation(trpc.songs.deleteOne.mutationOptions({
    onSuccess: async () => {
      toast.success("Song deleted successfully", { id: "song-delete" })

      // Invalidate queries
      await queryClient.invalidateQueries(trpc.songs.newest.queryOptions({}))
      await queryClient.invalidateQueries(trpc.songs.getMany.queryOptions({}))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong", { id: "song-delete" })
    }
  }))

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      toast.loading("Song deleting...", { id: "song-delete" })
      deleteMutation.mutate({ id })
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = `/api/download?songId=${id}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => router.push(`/songs/${id}`)}
          >
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDownload}
            disabled={deleteMutation.isPending}
          >
            <DownloadIcon />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="hover:!text-rose-500"
            disabled={deleteMutation.isPending}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
