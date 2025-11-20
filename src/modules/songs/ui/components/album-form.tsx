import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PencilIcon, XIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { extractFirstZodMessage } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

interface Props {
  id: string
  value: string | null
}

const formSchema = z.object({
  album: z.string().min(1, "Album is required")
})

export const AlbumForm = ({ id, value }: Props) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      album: value ?? ""
    }
  })

  const updateSong = useMutation(trpc.songs.updateSong.mutationOptions({
    onSuccess: async () => {
      setIsEditing(false)
      await queryClient.invalidateQueries(trpc.songs.getOne.queryOptions({ id }))
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateSong.mutate({ ...values, id })
  }

  const toggleEdit = () => setIsEditing((current) => !current)

  return (
    <div className="flex-1 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Album</p>
        <Button size="sm" variant="ghost" onClick={toggleEdit}>
          {isEditing ? <XIcon /> : <PencilIcon />}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{value}</p>}
      {isEditing && (
        <Form {...form}>
          <form className="space-y-2 mt-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="album"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      spellCheck="false"
                      autoComplete="off"
                      className="bg-background"
                      placeholder="Enter your album"
                      disabled={updateSong.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-x-2">
              <Button
                size="sm"
                type="submit"
                className="min-w-[120px]"
                disabled={updateSong.isPending}
              >
                {updateSong.isPending ? (
                  <LoaderIcon className="animate-spin text-white" />
                ) : (
                  <>Save changes</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
