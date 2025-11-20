"use client"

import Image from "next/image"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { PenIcon, LoaderIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUploadThing } from "@/lib/uploadthing"
import { Textarea } from "@/components/ui/textarea"
import { extractFirstZodMessage } from "@/lib/utils"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { editPlaylistSchema } from "../../schemas"
import { useEditPlaylistModal } from "../../store/use-edit-playlist-modal"

type ImageType = {
  file: File | null
  preview: string
}

export const EditPlaylistModal = () => {
  const editPlaylistModal = useEditPlaylistModal()
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const { isUploading, startUpload } = useUploadThing("imageUploader")

  const { data } = useQuery(trpc.playlists.getOne.queryOptions({ id: editPlaylistModal.id }, {
    enabled: !!editPlaylistModal.id && editPlaylistModal.open
  }))

  const [image, setImage] = useState<ImageType>({ file: null, preview: "" })

  const imageInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof editPlaylistSchema>>({
    resolver: zodResolver(editPlaylistSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      id: editPlaylistModal.id
    }
  })

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        title: data.title,
        description: data.description ?? "",
        image: data.thumbnailUrl ?? ""
      })

      setImage({
        file: null,
        preview: data.thumbnailUrl ?? ""
      })
    }
  }, [data, form])

  const editPlaylist = useMutation(trpc.playlists.updateOne.mutationOptions({
    onSuccess: async () => {
      editPlaylistModal.onClose()
      await queryClient.invalidateQueries(trpc.playlists.getMany.queryOptions())
      await queryClient.invalidateQueries(trpc.playlists.getOne.queryOptions({
        id: editPlaylistModal.id
      }))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    },
  }))

  const onSubmit = async (values: z.infer<typeof editPlaylistSchema>) => {
    let imageUrl: string | undefined = undefined

    if (image.file) {
      const result = await startUpload([image.file])
      imageUrl = result?.[0].ufsUrl
    }

    editPlaylist.mutate({ ...values, image: imageUrl, id: editPlaylistModal.id })
  }

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]

    if (file) {
      if (image.preview.startsWith("blob:")) {
        URL.revokeObjectURL(image.preview)
      }

      setImage({
        file,
        preview: URL.createObjectURL(file)
      })
    }

    // clear value
    e.target.value = ""
  }

  if (!data) return null

  return (
    <ResponsiveDialog
      open={editPlaylistModal.open}
      onOpenChange={editPlaylistModal.onClose}
      title="Edit playlist"
      description="Enter your content to continue."
      className="max-w-xl!"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="size-[165px] relative aspect-square rounded-md overflow-hidden group">
              {image.preview ? (
                <Image
                  fill
                  sizes="100%"
                  className="object-cover"
                  src={image.preview}
                  alt={data.title}
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
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={onSelectImage}
                ref={imageInputRef}
              />
              <Button
                type="button"
                variant="ghost"
                disabled={isUploading || editPlaylist.isPending}
                onClick={() => imageInputRef.current?.click()}
                className="size-8 absolute top-1 right-1 hidden group-hover:flex"
              >
                <PenIcon className="size-4" />
              </Button>
            </div>
            <div className="space-y-4 flex-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        spellCheck="false"
                        placeholder="Enter your title"
                        disabled={isUploading || editPlaylist.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        spellCheck="false"
                        className="resize-none"
                        disabled={isUploading || editPlaylist.isPending}
                        placeholder="Enter your description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-2">
            <Button type="button" variant="outline" disabled={isUploading || editPlaylist.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || editPlaylist.isPending}>
              Save changes
              {(isUploading || editPlaylist.isPending) && (
                <LoaderIcon className="text-white animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
