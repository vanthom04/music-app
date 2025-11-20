import * as React from "react"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Font
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

type SendOtp2FAProps = {
  otp: string
  appName?: string
  expiresMinutes?: number
}

export const SendOtp2FA = ({
  otp,
  appName = "Music App",
  expiresMinutes = 10
}: SendOtp2FAProps) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
              format: "woff2"
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Your 2FA OTP code for {appName}</Preview>
        <Body className="bg-gray-100 m-0 py-8 font-['Roboto']">
          <Container className="w-full max-w-[560px] mx-auto bg-white rounded-xl p-6 shadow">
            <Section className="mb-4">
              <h1 className="m-0 text-[22px] leading-[28px] font-bold text-gray-900">
                2-Step verification code (OTP)
              </h1>
              <Text className="mt-2 text-[14px] leading-6 text-gray-700">
                Use the code below to complete the login to {appName}.
              </Text>
            </Section>

            <Section className="text-center mb-2">
              <div className="inline-flex items-center justify-center tracking-[8px] font-bold text-2xl md:text-3xl px-5 py-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-200">
                {otp}
              </div>
              <Text className="mt-3 text-xs leading-5 text-gray-500">
                The OTP code will expire after {expiresMinutes} minutes.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-4" />

            <Section>
              <Text className="text-xs leading-5 text-gray-500 m-0">
                If you do not request this code, someone may be trying to access your account.
                Please ignore this email or change your password immediately.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
