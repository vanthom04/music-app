import { format } from "date-fns"
import { EditIcon, ShieldCheckIcon, ShieldXIcon, Trash2Icon } from "lucide-react"

import { Passkey } from "@/generated/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { parseTransports } from "../../utils"
import { useUpdatePasskeyModal } from "../../store/use-update-passkey-modal"

interface Props {
  passkey: Passkey
  disabled?: boolean
  onDelete: (id: string) => void
}

export const PasskeyItem = ({ passkey, disabled, onDelete }: Props) => {
  const updatePasskeyModal = useUpdatePasskeyModal()
  const transports = parseTransports(passkey.transports)

  return (
    <Card className="py-4 gap-2 shadow-none">
      <CardHeader className="h-full flex items-center justify-between px-4">
        <CardTitle className="flex items-center gap-x-2">
          {passkey.name || "Unknown device"}
          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
            {passkey.deviceType === "multiDevice" ? "Cross-platform" : "Platform"}
          </span>
        </CardTitle>
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            disabled={disabled}
            onClick={() => updatePasskeyModal.onOpen(passkey.id)}
          >
            <EditIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            disabled={disabled}
            onClick={() => onDelete(passkey.id)}
          >
            <Trash2Icon className="text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-x-2">
            <p className="text-sm font-medium">Register at:</p>
            <p className="text-sm text-muted-foreground">
              {format(passkey.createdAt, "HH:mm dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex items-center justify-center gap-x-2">
            {passkey.backedUp ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[13px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheckIcon className="size-3.5" /> Backed up
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[13px] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <ShieldXIcon className="size-3.5" /> Not backed up yet
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-2">
          <p className="text-sm font-medium">Transports:</p>
          <p className="flex flex-wrap gap-1">
            {transports.length ? (
              transports.map((transport) => (
                <span
                  key={transport}
                  className="rounded-full border px-2 py-0.5 text-xs capitalize"
                >
                  {transport}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
