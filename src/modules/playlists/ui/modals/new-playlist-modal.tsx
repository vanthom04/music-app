"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { LoaderIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { extractFirstZodMessage } from "@/lib/utils"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { newPlaylistSchema } from "../../schemas"
import { useNewPlaylistModal } from "../../store/use-new-playlist-modal"

export const NewPlaylistModal = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const newPlaylistModal = useNewPlaylistModal()

  const form = useForm<z.infer<typeof newPlaylistSchema>>({
    resolver: zodResolver(newPlaylistSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  })

  const newPlaylistMutation = useMutation(trpc.playlists.create.mutationOptions({
    onSuccess: async () => {
      onClose()
      toast.success("Created playlist successfully")

      // Invalidate queries
      await queryClient.invalidateQueries(trpc.playlists.getMany.queryOptions())
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const onSubmit = (values: z.infer<typeof newPlaylistSchema>) => {
    newPlaylistMutation.mutate(values)
  }

  const onClose = () => {
    newPlaylistModal.onClose()
    form.reset()
  }

  const isPending = newPlaylistMutation.isPending

  return (
    <ResponsiveDialog
      open={newPlaylistModal.open}
      onOpenChange={onClose}
      title="New playlist"
      description="Enter your playlist title to continue."
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter your playlist title..."
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
                    autoComplete="off"
                    disabled={isPending}
                    className="resize-none"
                    value={field.value ?? ""}
                    placeholder="Enter your playlist description..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-end gap-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[80px]" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
