"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { LoaderIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { setPasswordSchema } from "@/modules/account/schemas"

import { useTRPC } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn, extractFirstZodMessage } from "@/lib/utils"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { useSetPasswordModal } from "../../store/use-set-password-modal"

export const SetPasswordModal = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const setPasswordModal = useSetPasswordModal()

  const setPassword = useMutation(trpc.account.setPassword.mutationOptions({
    onSuccess: async () => {
      toast.success("Set password successfully")

      // Invalidate queries
      await queryClient.invalidateQueries(trpc.account.hasPassword.queryOptions())

      // Close and reset form
      onClose()
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = (values: z.infer<typeof setPasswordSchema>) => {
    setPassword.mutate(values)
  }

  const onClose = () => {
    setPasswordModal.onClose()
    form.reset()
  }

  const isPending = setPassword.isPending

  return (
    <ResponsiveDialog
      open={setPasswordModal.open}
      onOpenChange={onClose}
      title="Setup password"
      description="Enter your password to continue."
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    spellCheck="false"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter your password"
                    className={cn(
                      form.formState.errors.password && "placeholder:!text-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    spellCheck="false"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder="Enter confirm password"
                    className={cn(
                      form.formState.errors.confirmPassword && "placeholder:!text-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
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
