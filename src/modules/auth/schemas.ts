import { z } from "zod"

import { EMAIL_REGEX } from "@/constants"

export const signInSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Email is valid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(128, "Password must be less than 128 characters")
})

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().regex(EMAIL_REGEX, "Email is valid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(128, "Password must be less than 128 characters")
})

export const signInPasskeySchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Email is valid")
})

export const forgotPasswordSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Email is valid")
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your password")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match"
  })
