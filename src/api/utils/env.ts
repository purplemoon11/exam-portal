import dotenv from "dotenv"

dotenv.config()

export default {
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWTSECRET,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
}
