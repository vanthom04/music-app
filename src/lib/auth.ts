import { betterAuth } from "better-auth"
import { render } from "@react-email/render"
import { twoFactor } from "better-auth/plugins"
import { passkey } from "better-auth/plugins/passkey"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "@/lib/prisma"
import { APP_URL } from "@/constants"
import { sendEmail } from "@/lib/send-email"
import { SendOtp2FA } from "@/components/emails/send-otp-2fa"
import { VerifyEmail } from "@/components/emails/verify-email"
import { ResetPassword } from "@/components/emails/reset-password"

export const auth = betterAuth({
  appName: "Music App",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  advanced: {
    database: {
      generateId: false
    },
    useSecureCookies: true,
    cookiePrefix: "music_app"
  },
  user: {
    changeEmail: {
      enabled: false
    },
    deleteUser: {
      enabled: true
    }
  },
  emailVerification: {
    expiresIn: 15 * 60, // 15 minutes
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: await render(VerifyEmail({ url }))
      })
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
    sendResetPassword: async ({ user, token }) => {
      const url = `${APP_URL}/reset-password?token=${token}`
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: await render(ResetPassword({ url }))
      })
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  },
  plugins: [
    passkey(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        period: 10, // 10 minutes
        sendOTP: async ({ user, otp }) => {
          await sendEmail({
            to: user.email,
            subject: "2FA OTP Code",
            html: await render(SendOtp2FA({ otp }))
          })
        }
      }
    })
  ],
  baseURL: APP_URL
})
