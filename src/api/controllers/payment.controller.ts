import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/error-handler/catchAsync"
import {
  transactionCreate,
  transactionGet,
  transactionGetById,
  transactionDelete,
  transactionUpdate,
} from "../services/transaction.service"
import crypto from "crypto"
import axios from "axios"
import jwt from "jsonwebtoken"
import queryString from "querystring"
import logger from "../../config/logger"
import env from "../utils/env"
import { Transaction } from "../entity/transaction.entity"
import { jwtDecode } from "jwt-decode"
import ormConfig from "../../config/ormConfig"

const transRepo = ormConfig.getRepository(Transaction)

interface TransactionRequest extends Request {
  user: {
    id: string
  }
}

export const sendPaymentRequest = catchAsync(
  async (req: TransactionRequest, res: Response, next: any) => {
    const { amount, success_url, failure_url } = req.body

    let paymentData = {
      amount,
      tax_amount: "0",
      total_amount: "",
      transaction_uuid: crypto.randomBytes(4).toString("hex"),
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url,
      failure_url,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: "",
    }
    const totalAmount = JSON.stringify(
      parseInt(amount) + parseInt(paymentData.tax_amount)
    )

    paymentData["total_amount"] = totalAmount

    const { total_amount, transaction_uuid, product_code } = paymentData

    const secretKey = env.PAYMENT_KEY

    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(hashString)
      .digest("base64")

    paymentData["signature"] = hash

    let finalPaymentData = queryString.stringify(paymentData)

    console.log(paymentData)

    axios
      .post(
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        finalPaymentData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(async function (data) {
        const userId = parseInt(req.user.id)
        const transactionData = new Transaction()

        transactionData.cand_id = userId
        transactionData.total_amount = total_amount
        transactionData.transaction_uuid = transaction_uuid
        transactionData.transaction_code = ""
        transactionData.product_code = product_code
        transactionData.status = "Pending"
        transactionData.created_date = new Date()

        await transactionCreate(transactionData)

        logger.info("Payment successful")

        return res.json({
          data: data?.request?.res?.responseUrl,
          status: data?.status,
          statusText: data?.statusText,
        })
      })
      .catch(function (error) {
        if (error.response) {
          logger.error(error.response)
          return res
            .status(400)
            .json({ data: error.response.data, status: error.response.status })
        } else if (error.request) {
          logger.error(error.request)
          return res.status(400).json({ request: error.request })
        } else {
          logger.error(error.message)
          return res.status(400).json({ message: error.message })
        }
      })
  }
)

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query

    const decodedToken: { [key: string]: any } =
      jwtDecode(token as string, { header: true }) || {}

    if (!decodedToken) {
      return res.status(400).json({ message: "Invalid data" })
    }

    const headers = decodedToken

    const { product_code, total_amount, transaction_uuid, transaction_code } =
      headers

    const url = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`

    const response = await axios.get(url)

    const transactionData = await transRepo.findOne({
      where: { transaction_uuid },
    })

    if (response.data.status === "COMPLETE") {
      await transactionUpdate(transactionData, {
        status: "Done",
        transaction_code,
      })
    } else {
      return res.status(400).json({ message: "Payment unsuccessfull" })
    }

    return res.json({ status: response.data.status })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
