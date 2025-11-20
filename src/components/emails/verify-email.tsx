import * as React from "react"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Hr,
  Font
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

type VerifyEmailProps = {
  url: string
  appName?: string
}

export const VerifyEmail = ({ url, appName = "Music App" }: VerifyEmailProps) => {
  return (
    <Html>
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
      <Preview>Verify your email to start using {appName}</Preview>

      <Tailwind>
        <Body className="bg-gray-100 m-0 py-8 font-['Roboto']">
          <Container className="w-full max-w-[560px] mx-auto bg-white rounded-xl p-6 shadow">
            <Section className="mb-6">
              <h1 className="m-0 text-[22px] leading-[28px] font-bold text-gray-900">
                Verify email address
              </h1>
              <Text className="mt-2 text-[14px] leading-6 text-gray-700">
                Thank you for signing up for {appName}. Click the button below to verify your email
                address and complete account creation.
              </Text>
            </Section>

            <Section className="text-center mb-6">
              <Button
                href={url}
                className="inline-block px-5 py-3 rounded-lg no-underline font-semibold text-[14px] leading-5 bg-[#7033ff] text-white"
              >
                Verify email
              </Button>

              <Text className="mt-4 text-xs leading-5 text-gray-500 break-all">
                Button not working? Paste the following link into your browser:
                <br />
                <Link href={url} className="text-[#7033ff] underline">
                  {url}
                </Link>
              </Text>
            </Section>

            <Hr className="border-gray-200 my-3" />

            <Section>
              <Text className="text-xs leading-5 text-gray-500 m-0">
                If you did not create an account, please ignore this email. Need help? Contact:{" "}
                <Link href="mailto:vanthom04.dev@gmail.com" className="text-[#7033ff] underline">
                  vanthom04.dev@gmail.com
                </Link>
                .
              </Text>
              <Text className="mt-2 text-[11px] leading-4 text-gray-400">
                Links may expire after a short period of time for security reasons.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
