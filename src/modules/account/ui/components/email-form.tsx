import { Button } from "@/components/ui/button"

interface Props {
  value: string
}

export const EmailForm = ({ value }: Props) => {
  return (
    <div className="flex-1 border bg-slate-100 dark:bg-accent rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Email</p>
        <Button size="sm" variant="ghost" className="italic text-muted-foreground" disabled>
          Email cannot be changed
        </Button>
      </div>
      <p className="text-sm mt-2">{value}</p>
    </div>
  )
}
