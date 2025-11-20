"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { LoaderIcon } from "lucide-react"
import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useUpdatePasskeyModal } from "../../store/use-update-passkey-modal"

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required")
})

export const UpdatePasskeyModal = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { id, open, onClose } = useUpdatePasskeyModal()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: ""
    }
  })

  useEffect(() => {
    if (id) {
      form.setValue("id", id)
    }
  }, [id, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await authClient.passkey.updatePasskey(values, {
        onSuccess: async () => {
          handleClose()
          await queryClient.invalidateQueries(trpc.account.listPasskeys.queryOptions())
          toast.success("Passkey updated")
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title="Update passkey"
      description="Enter your new name passkey."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    spellCheck="false"
                    disabled={isPending}
                    placeholder="Enter your passkey name"
                    className={cn(form.formState.errors.name && "placeholder:!text-destructive")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-x-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="md:min-w-[90px]" disabled={isPending}>
              {isPending ? <LoaderIcon className="text-white animate-spin" /> : "Confirm"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
