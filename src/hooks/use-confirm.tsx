import { JSX, useState } from "react"

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"

interface UseConfirmOptions {
  title: string
  message: string
}

export const useConfirm = ({
  title,
  message
}: UseConfirmOptions): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve })
  })

  const handleCancel = () => {
    promise?.resolve(false)
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    setPromise(null)
  }

  const ConfirmDialog = () => {
    return (
      <AlertDialog open={promise !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return [ConfirmDialog, confirm]
}
