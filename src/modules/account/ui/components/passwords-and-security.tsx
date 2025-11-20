import { formatDistanceToNow } from "date-fns"
import { useQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import { useTwoFactorModal } from "../../store/use-two-factor-modal"
import { useSetPasswordModal } from "../../store/use-set-password-modal"
import { useUpdatePasswordModal } from "../../store/use-update-password-modal"

export const PasswordsAndSecurity = () => {
  const trpc = useTRPC()
  const twoFactorModal = useTwoFactorModal()
  const setPasswordModal = useSetPasswordModal()
  const updatePasswordModal = useUpdatePasswordModal()

  const { data: session, isPending } = authClient.useSession()
  const { data: hasPassword, isLoading } = useQuery(trpc.account.hasPassword.queryOptions())

  if (!session || hasPassword === undefined) {
    return null
  }

  return (
    <div className="flex-1 space-y-4">
      <h5 className="text-[17px] font-medium">Passwords and Security</h5>
      <div className="flex items-center justify-between border rounded-xl p-4">
        <div className="flex flex-col">
          <p className="text-[15px] font-medium">Password</p>
          <span className="text-sm text-muted-foreground">
            {!hasPassword && "You haven't set a password"}
            {hasPassword && (
              <span className="capitalize">
                {formatDistanceToNow(hasPassword.updatedAt, { addSuffix: true })}
              </span>
            )}
          </span>
        </div>
        <Button
          size="sm"
          variant="link"
          disabled={isPending || isLoading}
          className="hover:no-underline hover:opacity-75"
          onClick={hasPassword ? updatePasswordModal.onOpen : setPasswordModal.onOpen}
        >
          {hasPassword ? "Update" : "Set password"}
        </Button>
      </div>
      <div className="flex items-center justify-between border rounded-xl p-4">
        <div className="flex flex-col">
          <p className="text-[15px] font-medium">2FA (Two Factor Authentication)</p>
          <span className="text-sm text-muted-foreground">
            {session.user.twoFactorEnabled
              ? "Your account has 2-step verification enabled. Each login will require an OTP code."
              : "Enhance account security by requiring an OTP code every time you log in."}
          </span>
        </div>
        <Switch
          checked={!!session.user.twoFactorEnabled}
          disabled={!hasPassword || isPending || isLoading}
          onCheckedChange={() => twoFactorModal.onOpen(!!session.user.twoFactorEnabled)}
          title={
            hasPassword
              ? session.user.twoFactorEnabled
                ? "Disable"
                : "Enable"
              : "Please set up a password before enabling 2FA"
          }
        />
      </div>
    </div>
  )
}
