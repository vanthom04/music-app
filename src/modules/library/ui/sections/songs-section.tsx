import { toast } from "sonner"
import { MoreVerticalIcon, UploadIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { extractFirstZodMessage } from "@/lib/utils"
import { ErrorState } from "@/components/error-state"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

import { columns } from "../components/columns"

export const SongsSection = () => {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(trpc.songs.getMany.queryOptions({}))

  const deleteManyMutation = useMutation(trpc.songs.deleteMany.mutationOptions({
    onSuccess: async () => {
      toast.success("Songs deleted successfully", { id: "songs-delete" })

      // Invalidate queries
      await queryClient.invalidateQueries(trpc.songs.newest.queryOptions({}))
      await queryClient.invalidateQueries(trpc.songs.getMany.queryOptions({}))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong", { id: "songs-delete" })
    }
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">My songs</h4>
        <Button size="sm" onClick={() => router.push("/upload")}>
          <UploadIcon />
          Upload
        </Button>
      </div>
      <DataTable
        data={data}
        columns={columns}
        searchKey="title"
        disabled={deleteManyMutation.isPending}
        onDelete={(rows) => {
          const ids = rows.map((r) => r.original.id)
          toast.loading("Songs deleting...", { id: "songs-delete" })
          deleteManyMutation.mutate({ ids })
        }}
      />
    </div>
  )
}

export const SongsSectionLoading = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">My songs</h4>
        <Button size="sm">
          <UploadIcon />
          Upload
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <Input
            name="filter-search"
            className="max-w-sm"
            placeholder="Search title..."
          />
        </div>
        <div className="overflow-hidden w-full rounded-md border">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] text-center">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead className="w-[100px] text-center">
                  Duration
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`row-${index}`}>
                  <TableCell className="w-[40px] text-center">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="w-[40%]">
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell className="w-[100px] text-center">
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell className="w-[50px]">
                    <MoreVerticalIcon className="size-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export const SongsSectionError = () => {
  return (
    <ErrorState
      title="An error occurred"
      description="Please try again later."
    />
  )
}
