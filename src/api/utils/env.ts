import dotenv from "dotenv"

dotenv.config()

export default {
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWT_SECRET_KEY,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASSWORD,
  PAYMENT_KEY: process.env.PAYMENT_SECRET_KEY,
}
