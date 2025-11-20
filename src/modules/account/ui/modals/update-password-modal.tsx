"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { LoaderIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useUpdatePasswordModal } from "../../store/use-update-password-modal"

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(8, "Current password must be more than 8 characters")
      .max(128, "Current password must be less than 128 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be more than 8 characters")
      .max(128, "New password must be less than 128 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm new password")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match"
  })

export const UpdatePasswordModal = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const updatePasswordModal = useUpdatePasswordModal()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await authClient.changePassword(values, {
        onSuccess: async () => {
          onClose()
          toast.success("Password updated successfully")
          await queryClient.invalidateQueries(trpc.account.hasPassword.queryOptions())
        },
        onError: ({ error }) => {
          toast.error(error.message)
        }
      })
    })
  }

  const onClose = () => {
    updatePasswordModal.onClose()
    form.reset()
  }

  return (
    <ResponsiveDialog
      open={updatePasswordModal.open}
      onOpenChange={onClose}
      title="Update password"
      description="Enter new password to continue."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    spellCheck="false"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter current password"
                    className={cn(
                      form.formState.errors.currentPassword && "placeholder:!text-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    spellCheck="false"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter new password"
                    className={cn(
                      form.formState.errors.newPassword && "placeholder:!text-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    spellCheck="false"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter confirm new password"
                    className={cn(
                      form.formState.errors.confirmNewPassword && "placeholder:!text-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-x-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
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
