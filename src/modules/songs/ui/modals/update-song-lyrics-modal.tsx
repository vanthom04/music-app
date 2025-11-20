"use client"

import qs from "query-string"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { fetcher } from "@/lib/fetcher"
import { LRCLIB_URL } from "@/constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

import { LyricsSearch } from "../../types"
import { LyricsItem } from "../components/lyrics-item"
import { usePreviewLyricsModal } from "../../store/use-preview-lyrics-modal"
import { useUpdateSongLyricsModal } from "../../store/use-update-song-lyrics-modal"

const formSchema = z
  .object({
    title: z.string().optional().or(z.literal("")),
    artist: z.string().optional().or(z.literal(""))
  })
  .refine((data) => data.title?.trim() || data.artist?.trim(), {
    error: "At least one of the two fields must be entered",
    path: ["title", "artist"]
  })

export const UpdateSongLyricsModal = () => {
  const { songId, open, onClose } = useUpdateSongLyricsModal()
  const previewLyricsModal = usePreviewLyricsModal()

  const [result, setResult] = useState<LyricsSearch[]>([])
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const url = qs.stringifyUrl({
          url: `${LRCLIB_URL}/api/search`,
          query: {
            track_name: values.title,
            artist_name: values.artist
          }
        }, { skipNull: true })

        const data = await fetcher<LyricsSearch[]>(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })

        setResult(data)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }

        toast.error("Something went wrong")
        console.error(error)
      }
    })
  }

  const handleClose = () => {
    setResult([])
    form.reset()
    onClose()
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title="Update lyrics"
      description="Enter song title or song artist to find matching lyrics"
      className="max-w-[580px]!"
    >
      <div className="flex-1 space-y-3">
        <h5 className="font-medium">Search lyrics</h5>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-x-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        autoComplete="off"
                        disabled={isPending}
                        placeholder="Enter song title"
                        className={cn(
                          form.formState.errors.title && "placeholder:!text-destructive"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        autoComplete="off"
                        disabled={isPending}
                        placeholder="Enter song artist"
                        className={cn(
                          form.formState.errors.artist && "placeholder:!text-destructive"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full font-normal" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Search lyrics"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="h-[250px] overflow-y-auto space-y-2">
        {result.map((lyric) => (
          <LyricsItem
            key={lyric.id}
            songId={songId}
            title={lyric.trackName}
            artist={lyric.artistName}
            duration={lyric.duration}
            plainText={lyric.plainLyrics}
            syncedText={lyric.syncedLyrics}
            onShowPreview={() => previewLyricsModal.onOpen({
              plain: lyric.plainLyrics,
              synced: lyric.syncedLyrics
            })}
            onClose={handleClose}
          />
        ))}
        {result.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[15px] text-muted-foreground">No lyrics</p>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  )
}
