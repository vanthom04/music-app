import { SidebarProvider } from "@/components/ui/sidebar"

import { AccountNavbar } from "../components/account-navbar"
import { AccountSidebar } from "../components/account-sidebar"

interface Props {
  children: React.ReactNode
}

export const AccountLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <AccountNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <AccountSidebar />
          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
