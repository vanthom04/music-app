import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_SERVER_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_SERVER_USER,
    pass: process.env.SMTP_SERVER_PASS
  }
})

export const sendEmail = async (options: Mail.Options) => {
  await transporter.sendMail({
    from: `Music App <${process.env.SMTP_SERVER_USER}>`,
    ...options
  })
}
