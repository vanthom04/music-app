import { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/client"
import { AudioProvider } from "@/components/providers/audio-provider"
import { ModalProvider } from "@/components/providers/modal-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Music Player",
  description: "A simple music player built with Next.js and React",
  authors: [{ name: "vanthom04", url: "https://github.com/vanthom04" }],
  keywords: ["music app", "music player"],
  icons: [{ url: "/favicon.ico" }]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased overflow-hidden`}>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            {children}
            <AudioProvider />
            <ModalProvider />
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </TRPCReactProvider>
  )
}
