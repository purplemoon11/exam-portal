import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/error-handler/catchAsync"
import crypto from "crypto"
import axios from "axios"
import queryString from "querystring"
import logger from "../../config/logger"

export const sendPaymentRequest = catchAsync(
  async (req: Request, res: Response, next: any) => {
    let paymentData = {
      amount: "100",
      tax_amount: "10",
      total_amount: "110",
      transaction_uuid: crypto.randomBytes(4).toString("hex"),
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: "https://google.com",
      failure_url: "https://google.com",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: "",
    }

    // let otherPaymentData = {
    //   transaction_code: "0006AKE",
    //   status: "COMPLETE",
    //   total_amount: "110.0",
    //   transaction_uuid: "b64c6b27",
    //   product_code: "EPAYTEST",
    //   signed_field_names:
    //     "transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names",
    // }

    // const {
    //   transaction_code,
    //   status,
    //   product_code: other_code,
    //   total_amount: other_amount,
    //   transaction_uuid: other_uuid,
    //   signed_field_names,
    // } = otherPaymentData

    const { total_amount, transaction_uuid, product_code } = paymentData

    console.log(transaction_uuid)

    const secretKey = "8gBm/:&EnhH.1/q"

    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`

    // const hashStringOthers = `transaction_code=${transaction_code},status=${status},total_amount=${other_amount},transaction_uuid=${other_uuid},product_code=${other_code},signed_field_names=${signed_field_names}`

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(hashString)
      .digest("base64")

    // const hashOther = crypto
    //   .createHmac("sha256", secretKey)
    //   .update(hashStringOthers)
    //   .digest("base64")

    paymentData["signature"] = hash

    let finalPaymentData = queryString.stringify(paymentData)

    // console.log(hash, hashOther)

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
      .then(function (data) {
        res.json({
          data: data?.request?.res?.responseUrl,
          status: data?.status,
          statusText: data?.statusText,
        })
      })
      .catch(function (error) {
        if (error.response) {
          res
            .status(400)
            .json({ data: error.response.data, status: error.response.status })
        } else if (error.request) {
          res.status(400).json({ request: error.request })
        } else {
          res.status(400).json({ message: error.message })
        }
        res.status(400).json({ config: error.config })
      })
  }
)

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_code = "EPAYTEST"
    const total_amount = "110"
    const transaction_uuid = "77513486"

    const url = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`

    const response = await axios.get(url)

    res.json({ data: response.data })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
