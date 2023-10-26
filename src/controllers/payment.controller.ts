import { Request, Response } from "express"
import { catchAsync } from "../api/utils/catchAsync"
import crypto from "crypto"
import axios from "axios"
import queryString from "querystring"

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
      success_url: "https://esewa.com.np",
      failure_url: "https://google.com",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: "",
    }

    const { total_amount, transaction_uuid, product_code } = paymentData

    const secretKey = "8gBm/:&EnhH.1/q"

    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(hashString)
      .digest("base64")

    paymentData["signature"] = hash

    let finalPaymentData = queryString.stringify(paymentData)
    console.log(finalPaymentData)

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
          status: data.status,
          statusText: data.statusText,
          response: data.request.res,
        })
        // console.log()
      })
      .catch(function (error) {
        // console.log(error)
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message)
        }
        console.log(error.config)
      })
  }
)
