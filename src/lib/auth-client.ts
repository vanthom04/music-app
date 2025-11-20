import { toast } from "sonner"
import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/plugins"
import { passkeyClient } from "better-auth/client/plugins"

import { APP_URL } from "@/constants"

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    twoFactorClient()
  ],
  fetchOptions: {
    onError: ({ error }) => {
      if (error.status === 429) {
        toast.error("Too many requests. Please try again later.")
      }
    }
  },
  baseURL: APP_URL
})
