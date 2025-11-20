import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { extractFirstZodMessage } from "@/lib/utils"

export const DeleteAccount = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action cannot be undone."
  })

  const deleteUser = useMutation(trpc.account.deleteCurrent.mutationOptions({
    onSuccess: () => {
      router.replace("/sign-in")
    },
    onError: (error) => {
      const msg = extractFirstZodMessage(error)
      toast.error(msg ?? error.message ?? "Something went wrong")
    }
  }))

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteUser.mutate()
    }
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-col">
          <h5 className="text-[17px] font-medium">Delete account</h5>
          <span className="text-sm text-muted-foreground">
            Delete your account and all associated data. This action{" "}
            <strong> cannot be completed</strong>.
          </span>
        </div>
        <Button
          size="lg"
          variant="outline"
          onClick={onDelete}
          disabled={deleteUser.isPending}
          className="text-red-500 hover:text-red-500"
        >
          <Trash2Icon />
          Delete account
        </Button>
      </div>
    </>
  )
}
