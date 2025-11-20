import Link from "next/link"
import Image from "next/image"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserButton } from "@/modules/auth/ui/components/user-button"

export const AccountNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background flex items-center px-2 pr-5 z-50 border-b shadow-sm">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="md:hidden [&_svg]:!size-5" />
          <Link href="/profile">
            <div className="p-4 flex items-center gap-x-2">
              <Image width={32} height={32} src="/images/logo.png" alt="Logo" />
              <p className="text-2xl font-semibold tracking-normal">Account management</p>
            </div>
          </Link>
        </div>
        <div className="flex-shrink-0 items-center flex ml-auto">
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
