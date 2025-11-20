import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PencilIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

interface Props {
  value: string
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required")
})

export const NameForm = ({ value }: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: value
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await authClient.updateUser(values, {
      onSuccess: () => {
        setIsEditing(false)
      },
      onError: ({ error }) => {
        toast.error(error.message)
      }
    })
  }

  const toggleEdit = () => setIsEditing((current) => !current)

  return (
    <div className="flex-1 border bg-slate-100 dark:bg-accent rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Name</p>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      autoFocus
                      spellCheck="false"
                      autoComplete="off"
                      placeholder="Enter your name"
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        "bg-white",
                        form.formState.errors.name && "placeholder:!text-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-x-2">
              <Button size="sm" type="button" variant="outline" onClick={toggleEdit}>
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                className="min-w-[120px]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
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
