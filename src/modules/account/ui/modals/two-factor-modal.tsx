"use client"

import { z } from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { LoaderIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useTwoFactorModal } from "../../store/use-two-factor-modal"

const formSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(128, "Password must be less than 128 characters")
})

export const TwoFactorModal = () => {
  const { twoFactorEnable, open, onClose } = useTwoFactorModal()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (twoFactorEnable) {
      startTransition(async () => {
        await authClient.twoFactor.disable(values, {
          onSuccess: () => {
            handleClose()
          },
          onError: ({ error }) => {
            toast.error(error.message)
          }
        })
      })
    } else {
      startTransition(async () => {
        await authClient.twoFactor.enable(values, {
          onSuccess: () => {
            handleClose()
          },
          onError: ({ error }) => {
            toast.error(error.message)
          }
        })
      })
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title={`${twoFactorEnable ? "Disable" : "Enable"} Two Factor`}
      description="Enter your password to continue."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    className={cn(form.formState.errors.password && "placeholder:!text-destructive")}
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
              disabled={isPending}
              onClick={handleClose}
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
