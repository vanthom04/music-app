"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"

interface Props extends React.ComponentProps<typeof NextThemeProvider> {}

export const ThemeProvider = ({ children, ...props }: Props) => {
  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  )
}
