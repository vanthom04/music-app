import { toast } from "sonner"
import { useTransition } from "react"
import { LoaderIcon, PlusIcon } from "lucide-react"
import { useQueryClient, useQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"

import { PasskeyItem } from "./passkey-item"

export const PasskeyManager = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [isDeleting, startDeleteTransition] = useTransition()

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action cannot be undone."
  })

  const { data, isLoading } = useQuery(trpc.account.listPasskeys.queryOptions())

  const onRegisterPasskey = async () => {
    await authClient.passkey.addPasskey(undefined, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.account.listPasskeys.queryOptions())
      },
      onError: ({ error }) => {
        toast.error(error.message)
      }
    })
  }

  const onDeletePasskey = async (id: string) => {
    const ok = await confirm()

    if (ok) {
      startDeleteTransition(async () => {
        await authClient.passkey.deletePasskey({ id }, {
          onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.account.listPasskeys.queryOptions())
          },
          onError: ({ error }) => {
            toast.error(error.message)
          }
        })
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-[17px] font-medium">Passkey manager</h5>
          <Button size="sm" variant="outline">
            <PlusIcon />
            New passkey
          </Button>
        </div>
        <div className="flex items-center justify-center rounded-xl border py-6 bg-card">
          <LoaderIcon className="size-5 text-muted-foreground animate-spin" />
        </div>
      </div>
    )
  }

  if (data === undefined) {
    return null
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-[17px] font-medium">Passkey manager</h5>
          <Button size="sm" variant="outline" onClick={onRegisterPasskey}>
            <PlusIcon />
            New passkey
          </Button>
        </div>
        {data.map((passkey) => (
          <PasskeyItem
            key={passkey.id}
            passkey={passkey}
            disabled={isDeleting}
            onDelete={onDeletePasskey}
          />
        ))}
        {data.length === 0 && (
          <div className="bg-card flex items-center justify-center rounded-xl border py-6">
            <p className="text-[15px] text-muted-foreground italic">
              You have not added any Passkey. Please add a Passkey to log in without a password.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
