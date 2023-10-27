import { createTransport } from "nodemailer"
import logger from "../../config/logger"
import env from "./env"

export async function sendEmail(
  email: string,
  otp: string,
  name: string,
  response: any
) {
  try {
    const transporter = createTransport({
      //   host: "smtp.hostinger.com",
      //   port: 465,
      //   secure: true,
      service: "Gmail",
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    })

    let sentMail = await transporter.sendMail({
      from: env.MAIL_USER,
      to: email,
      subject: "Exam Portal",
      text: "Pdot exam portal",
      html: `<div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                  width: 99%;
                  margin: 0 auto;
                background-color: #f5f5f5;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              ">
                      <div>
                          <div variant="h6" style="text-align: center; letter-spacing: 2px; margin: 10px auto;">Welcome to Merchant App
                          </div>
                              <div variant="body1" style="text-align: center; letter-spacing: 2px; color: gray; margin: 30px auto;">Exam Portal</div>
                              <div variant="body1" style="text-align: center; letter-spacing: 1px; color: gray; margin: 20px auto;">Hi, ${name}, here is your otp: <br>${otp}</div>
                              <div variant="body1" style="text-align: center; letter-spacing: 2px; margin: 10px auto;">-Merchant Team</div>
                          </div>
                      </div>`,
    })

    return sentMail.accepted.length > 0
  } catch (error) {
    logger.error(error)
    response.status(500).json({ message: "Failed to send mail", error })
  }
}
