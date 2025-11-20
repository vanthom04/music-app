import { AccountLayout } from "@/modules/account/ui/layouts/account-layout"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <AccountLayout>{children}</AccountLayout>
}
