import { toast } from "sonner"
import { parseBlob } from "music-metadata"
import { useDropzone } from "react-dropzone"
import { useState, useTransition } from "react"
import { LoaderIcon, UploadIcon } from "lucide-react"

import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"

import { SongPreviewItem } from "./song-preview-item"
import { LocalSongItem } from "../../types"

export const FileUpload = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<LocalSongItem[]>([])
  const [progress, setProgress] = useState({ done: 0, total: 0, failed: 0 })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [".mp3"] },
    maxSize: 15 * 1024 * 1024, // 15 MB
    multiple: true,
    maxFiles: 10,
    onDrop: async (files) => {
      setIsLoading(true)
      try {
        const results = await Promise.all(
          files.map(async (audioFile) => {
            const { common, format } = await parseBlob(audioFile)

            const imageType = common.picture![0].format || "image/jpeg"
            const imageBytes = common.picture![0].data as Uint8Array<ArrayBuffer> | undefined
            const imageFile = imageBytes ? new Blob([imageBytes], { type: imageType }) : null

            return {
              id: crypto.randomUUID(),
              title: common.title || "Unknown Title",
              artist: common.artist || "Unknown Artist",
              album: common.album || "Unknown Album",
              duration: format.duration || 0,
              lyrics: common.lyrics?.[0].text,
              image: imageFile,
              audio: audioFile,
              imagePreview: imageFile ? URL.createObjectURL(imageFile) : undefined,
              audioPreview: URL.createObjectURL(audioFile)
            }
          })
        )

        setItems((prev) => [...prev, ...results])
      } finally {
        setIsLoading(false)
      }
    }
  })

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      // Thu hồi preview URL để tránh memory leak
      if (item?.imagePreview) URL.revokeObjectURL(item.imagePreview)
      if (item?.audioPreview) URL.revokeObjectURL(item.audioPreview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const onUploadSongs = () => {
    if (items.length === 0) {
      return toast.error("No files to upload.")
    }

    const queue = [...items]
    setProgress({ done: 0, total: queue.length, failed: 0 })

    startTransition(async () => {
      toast.loading("Uploading...", { id: "upload-songs" })
      let success = 0
      let failed = 0

      for (const item of queue) {
        const formData = new FormData()
        formData.append("title", item.title)
        formData.append("artist", item.artist)
        formData.append("album", item.album ?? "")
        formData.append("duration", String(item.duration))
        formData.append("audio", item.audio)
        if (item.lyrics) formData.append("lyrics", item.lyrics)
        if (item.image) formData.append("image", item.image)

        try {
          await fetcher("/api/song/upload", {
            method: "POST",
            timeout: 180000,
            body: formData
          })

          success += 1
          removeItem(item.id)
        } catch {
          failed += 1
        } finally {
          setProgress((p) => ({ ...p, done: p.done + 1, failed }))
          toast.loading(`Uploading ${success}/${queue.length}.`, { id: "upload-songs" })
        }
      }

      if (failed === 0) {
        toast.success("All songs uploaded successfully.", { id: "upload-songs" })
      } else {
        toast.info(`${queue.length - failed} uploaded, ${failed} failed.`, {
          id: "upload-songs"
        })
      }
    })
  }

  const canUpload = items.length > 0 && !isPending

  return (
    <>
      <div
        {...getRootProps()}
        className="bg-card p-6 h-36 rounded-lg border-2 border-dashed border-border cursor-pointer"
      >
        <div className="flex h-full flex-col items-center justify-center">
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the files here</p>
          ) : (
            <>
              <UploadIcon className="size-9 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Click to upload or drag and drop (Maximum 10 files)
              </p>
              <p className="text-sm text-muted-foreground/80">
                MP3, WAV, M4P files supported (15 MB)
              </p>
            </>
          )}
        </div>
        <input name="input-file" className="hidden" disabled={isPending} {...getInputProps()} />
      </div>
      {items.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {items.map((item) => (
              <SongPreviewItem
                key={item.id}
                data={item}
                disabled={isPending}
                onUpdate={(id, data) => {
                  setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
                }}
                onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
              />
            ))}
            {isLoading && (
              <div className="flex flex-col items-center justify-center mt-4 gap-y-2">
                <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Loading metadata, please wait...</p>
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse lg:flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setItems([])}
              className="max-lg:w-full min-w-20"
            >
              Cancel
            </Button>
            <Button
              onClick={onUploadSongs}
              disabled={!canUpload || isPending}
              className="max-lg:w-full min-w-24"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="text-white animate-spin" />
                  Uploading {progress.done}/{progress.total}
                </>
              ) : (
                `Upload (${items.length})`
              )}
            </Button>
          </div>
        </div>
      )}
      {items.length === 0 && isLoading && (
        <div className="flex flex-col items-center justify-center mt-4 gap-y-2">
          <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Loading metadata, please wait...</p>
        </div>
      )}
    </>
  )
}
