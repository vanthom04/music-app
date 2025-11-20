import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClipboardIcon, LoaderIcon, XCircleIcon } from "lucide-react"

import { fetcher } from "@/lib/fetcher"
import { useTRPC } from "@/trpc/client"
import { cn, formatTime } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { extractFirstZodMessage } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"

import { probeUrlSchema } from "@/modules/songs/schemas"

import { LocalSongItem } from "../../types"

type SongInfo = Omit<LocalSongItem, "id" | "audio" | "audioPreview" | "image"> & {
  image: {
    mime: string
    data: string
  } | null
}

export const LinkUpload = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [isUploading, setIsUploading] = useState(false)
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null)

  const probeUrlForMetadata = useMutation(trpc.songs.probeUrlForMetadata.mutationOptions({
    onSuccess: (data) => {
      setSongInfo(data)
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const form = useForm<z.infer<typeof probeUrlSchema>>({
    resolver: zodResolver(probeUrlSchema),
    defaultValues: {
      url: ""
    }
  })

  const handlePasteOrClearUrl = async () => {
    const value = form.getValues("url")

    if (value) {
      form.reset({ url: "" })
    } else {
      const text = await navigator.clipboard.readText()
      form.setValue("url", text)
    }
  }

  const onSubmit = async (values: z.infer<typeof probeUrlSchema>) => {
    probeUrlForMetadata.mutate(values)
  }

  const onSongUpdate = (song: Partial<SongInfo>) => {
    setSongInfo((prev) => (prev ? { ...prev, ...song } : null))
  }

  const onUploadSongByUrl = async () => {
    const url = form.getValues("url")

    if (!url || !songInfo) {
      return toast.error("No song info")
    }

    try {
      setIsUploading(true)
      toast.loading("Uploading...", { id: "song-upload-url" })

      await fetcher("/api/song/upload-by-url", {
        method: "POST",
        timeout: 60000,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...songInfo, url })
      })

      form.reset()
      setSongInfo(null)
      toast.success("Song uploaded successfully", { id: "song-upload-url" })

      // Invalidate queries
      await queryClient.invalidateQueries(trpc.songs.newest.queryOptions({}))
      await queryClient.invalidateQueries(trpc.songs.getMany.queryOptions({}))
    } catch {
      toast.error("Something went wrong", { id: "song-upload-url" })
    } finally {
      setIsUploading(false)
    }
  }

  const isPending = probeUrlForMetadata.isPending || isUploading

  return (
    <>
      <div className="bg-card p-6 h-24 rounded-lg border-2 border-dashed border-border">
        <div className="flex-1 h-full flex items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex items-center gap-x-2"
            >
              <div className="relative w-full">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          spellCheck="false"
                          autoComplete="off"
                          disabled={isPending}
                          placeholder="Paste link..."
                          className={cn(
                            "w-full h-10 pr-10",
                            form.formState.errors.url && "placeholder:!text-destructive"
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handlePasteOrClearUrl}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-200 rounded-md disabled:opacity-50"
                >
                  {form.watch("url") ? (
                    <XCircleIcon className="size-4" />
                  ) : (
                    <ClipboardIcon className="size-4" />
                  )}
                </button>
              </div>
              <Button type="submit" className="h-10 w-20" disabled={isPending}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {probeUrlForMetadata.isPending && (
        <div className="flex flex-col items-center justify-center gap-y-2 mt-6">
          <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Loading metadata, please wait...</p>
        </div>
      )}
      {songInfo && !probeUrlForMetadata.isPending && (
        <Card className="w-full mx-auto mt-6">
          <CardContent className="flex gap-x-4">
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  disabled={isPending}
                  value={songInfo.title}
                  placeholder="Enter your song title"
                  onChange={(e) => onSongUpdate({ title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  disabled={isPending}
                  value={songInfo.artist}
                  placeholder="Enter your song artist"
                  onChange={(e) => onSongUpdate({ artist: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="album">Album</Label>
                <Input
                  id="album"
                  disabled={isPending}
                  value={songInfo.album}
                  placeholder="Enter your song album"
                  onChange={(e) => onSongUpdate({ album: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration">Duration ({formatTime(songInfo.duration)})</Label>
                <Input
                  disabled
                  id="duration"
                  type="number"
                  value={songInfo.duration}
                />
              </div>
            </div>
            <div className="w-[260px] h-[260px] aspect-square relative rounded-md overflow-hidden border group/image">
              {songInfo.image ? (
                <img
                  alt={songInfo.title}
                  src={songInfo.image.data}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <span>No image</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-x-2">
            <Button variant="outline" disabled={isPending} onClick={() => setSongInfo(null)}>
              Cancel
            </Button>
            <Button className="min-w-20" disabled={isPending} onClick={onUploadSongByUrl}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Confirm"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
