import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/error-handler/catchAsync";
import {
  transactionCreate,
  transactionGetByUser,
  transactionUpdate,
} from "../services/transaction.service";
import crypto from "crypto";
import axios from "axios";
import queryString from "querystring";
import logger from "../../config/logger";
import env from "../utils/env";
import { ETransactionSource, Transaction } from "../entity/transaction.entity";
import { ExamSetting } from "../entity/examSetting.entity";
import { jwtDecode } from "jwt-decode";
import ormConfig from "../../config/ormConfig";
import { logPaymentData } from "../../config/mongoDB";

const transRepo = ormConfig.getRepository(Transaction);
const examSettingRepo = ormConfig.getRepository(ExamSetting);

interface TransactionRequest extends Request {
  user: {
    id: string;
  };
}

export const sendPaymentRequest = catchAsync(
  async (req: TransactionRequest, res: Response, next: any) => {
    const { success_url, failure_url } = req.body;

    const examSetting = await examSettingRepo.find();

    let amount = examSetting[0]?.exam_fee || "700";

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
    };

    const totalAmount = JSON.stringify(
      parseInt(amount) + parseInt(paymentData.tax_amount)
    );

    paymentData["total_amount"] = totalAmount;

    const { total_amount, transaction_uuid, product_code } = paymentData;

    const secretKey = env.PAYMENT_KEY;

    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(hashString)
      .digest("base64");

    paymentData["signature"] = hash;

    let finalPaymentData = queryString.stringify(paymentData);
    const paymentRequest = {
      type: "web_payment_initiation",
      timestamp: new Date(),
      cand_id: +req.user.id,
      ...paymentData,
    };
    logPaymentData(paymentRequest);

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
        console.log("dataaa", data?.request);
        const paymentRedirect = {
          type: "web_payment_initiation_response",
          timestamp: new Date(),
          cand_id: +req.user.id,
          transaction_uuid: transaction_uuid,
          status: data.request.res.statusCode,
          statusMessage: data.request.res.statusMessage,
        };
        logPaymentData(paymentRedirect);

        const userId = parseInt(req.user.id);
        const transactionData = new Transaction();

        transactionData.cand_id = userId;
        transactionData.total_amount = total_amount;
        transactionData.transaction_uuid = transaction_uuid;
        transactionData.transaction_code = "";
        transactionData.product_code = product_code;
        transactionData.status = "Pending";
        transactionData.transactionSource = ETransactionSource.WEB;
        transactionData.created_date = new Date();

        await transactionCreate(transactionData);

        logger.info("Payment initiated");

        return res.json({
          data: data?.request?.res?.responseUrl,
          status: data?.status,
          statusText: data?.statusText,
        });
      })
      .catch(async function (error) {
        if (error.response) {
          const errData = {
            type: "web_payment_request_error",
            timestamp: new Date(),
            cand_id: +req.user.id,
            error: error.response,
          };
          await logPaymentData(errData);
          logger.error(error.response, "Error1");
          return res
            .status(400)
            .json({ data: error.response.data, status: error.response.status });
        } else if (error.request) {
          const errData = {
            type: "web_payment_request_error",
            timestamp: new Date(),
            cand_id: +req.user.id,
            error: error.request,
          };
          await logPaymentData(errData);
          logger.error(error.request, "Error2");
          return res.status(400).json({ request: error.request });
        } else {
          const errData = {
            type: "web_payment_request_error",
            timestamp: new Date(),
            cand_id: +req.user.id,
            error: error.message,
          };
          await logPaymentData(errData);
          logger.error(error.message, "Error3");
          return res.status(400).json({ message: error.message });
        }
      });
  }
);

export const sendPaymentRequestForMobile = catchAsync(
  async (req: TransactionRequest, res: Response, next: any) => {
    // const { success_url, failure_url } = req.body;

    const examSetting = await examSettingRepo.find();

    let amount = examSetting[0]?.exam_fee || "700";
    const transaction_uuid = crypto.randomBytes(4).toString("hex");

    let paymentData = {
      productId: crypto.randomBytes(4).toString("hex"),
      productName: "pdot_exam",
      amount: amount,
      clientId: process.env.CLIENT_ID!,
      secretId: process.env.CLIENT_SECRET!,
    };
    const transactionData = await transRepo.findOne({
      where: { productId: paymentData.productId },
    });
    if (transactionData) {
      return res.status(500).json({ message: "Server error,Please try again" });
    }
    console.log(paymentData);

    function encrypt(data: any, key: any, iv: any) {
      const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
      let encrypted = cipher.update(data, "utf8", "base64");
      encrypted += cipher.final("base64");
      return encrypted;
    }
    // function decrypt(data: any, key: any, iv: any) {
    //   const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    //   let decrypted = decipher.update(data, "base64", "utf8");
    //   decrypted += decipher.final("utf8");
    //   return decrypted;
    // }
    const iv = Buffer.from(process.env.PUBLIC_IV, "base64");
    const key = Buffer.from(process.env.PUBLIC_KEY, "base64");

    const paymentDataJson = JSON.stringify(paymentData);
    const encryptedData = encrypt(paymentDataJson, key, iv);
    console.log("encrypted", encryptedData);

    // const decryptedData = decrypt(encryptedData, key, iv);
    // const paymentData1 = JSON.parse(decryptedData);
    // console.log("decrypted", paymentData1);
    if (!encryptedData) {
      return res
        .status(400)
        .json({ message: "Unable to retrive payment data,Please try again" });
    }
    const newTrans = new Transaction();
    newTrans.cand_id = +req.user.id;
    newTrans.total_amount = amount;
    newTrans.transaction_uuid = transaction_uuid;
    newTrans.transaction_code = "";
    newTrans.product_code = "";
    newTrans.status = "Pending";
    newTrans.productId = paymentData.productId;
    newTrans.transactionSource = ETransactionSource.MOBILE;
    newTrans.created_date = new Date();
    await transactionCreate(newTrans);
    const paymentRequest = {
      type: "mobile_payment_initiation",
      timestamp: new Date(),
      cand_id: +req.user.id,
      status: "processing",
      amount: paymentData.amount,
      productId: paymentData.productId,
      transaction_uuid: transaction_uuid,
    };
    logPaymentData(paymentRequest);

    return res.status(200).json({ encryptedData });
  }
);

export const verifyPayment = async (
  req: TransactionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    const decodedToken: { [key: string]: any } =
      jwtDecode(token as string, { header: true }) || {};

    if (!decodedToken) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const headers = decodedToken;

    const { product_code, total_amount, transaction_uuid, transaction_code } =
      headers;

    const url = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const response = await axios.get(url);

    const transactionData = await transRepo.findOne({
      where: { transaction_uuid },
    });

    if (response.data.status === "COMPLETE") {
      const verificationRes = {
        type: "web_payment_verification_response",
        timestamp: new Date(),
        cand_id: +req.user.id,
        responseData: response.data,
      };
      await logPaymentData(verificationRes);
      await transactionUpdate(transactionData, {
        status: "Done", //Change
        refId: response.data.refId,
        transaction_code,
      });
    } else {
      return res.status(400).json({ message: "Payment unsuccessfull" });
    }

    return res.json({ status: response.data.status });
  } catch (err) {
    const verificationError = {
      type: "web_payment_verification_error",
      timestamp: new Date(),
      cand_id: +req.user.id,
      responseError: err.data,
    };
    await logPaymentData(verificationError);
    logger.error(err);
    res.status(500).send(err);
  }
};

export const verifyMobilePayment = async (
  req: TransactionRequest,
  res: Response
) => {
  try {
    console.log("bodyyy", req.body);
    const { refId, productId } = req.body;
    const URL = process.env.VERIFICATION_API!;
    // const data = {
    //   merchantId: process.env.CLIENT_ID,
    //   merchantSecret: process.env.CLIENT_SECRET,
    // };
    const data = {
      type: "mobile_payment_verification_request",
      timestamp: new Date(),
      cand_id: +req.user.id,
      ...req.body,
    };
    logPaymentData(data);

    console.log(`${URL}${refId}`);

    const response = await axios.get(`${URL}${refId}`, {
      headers: {
        merchantId: process.env.CLIENT_ID,
        merchantSecret: process.env.CLIENT_SECRET,
        "Content-Type": "application/json",
      },
      // params:{
      //   data
      // }
    });
    if (
      response.status === 200 ||
      response.data.transactionDetails.status === "COMPLETE"
    ) {
      console.log("testinggg");
      const responseData = {
        type: "mobile_payment_verification_response",
        timestamp: new Date(),
        cand_id: +req.user.id,
        responseData: response.data,
      };
      await logPaymentData(responseData);
    }

    console.log("ressss", response.data);

    const transactionData = await transRepo.findOne({
      where: { productId },
    });
    if (!transactionData) {
      return res
        .status(400)
        .json({ message: "Unable to find transaction data" });
    }
    transactionData.status = "COMPLETE";
    transactionData.refId = req.body.refId;
    await transRepo.save(transactionData);
    console.log("trans", transactionData);
    return res
      .status(200)
      .json({ message: "payment verified successfully", data: response.data });
    // transactionData.status= response.data.transactionDetails.status
  } catch (err: any) {
    console.log("errrr", err.data);
    const errData = {
      type: "mobile_payment_verification_error",
      timestamp: new Date(),
      cand_id: +req.user.id,
      error: err.data,
    };
    await logPaymentData(errData);

    return res
      .status(400)
      .json({ message: "Error while verifying payment", err });
  }
};

export const checkPaymentStatus = async (
  req: TransactionRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.user.id);

  const payment = await transactionGetByUser(userId);

  const examSetting = await examSettingRepo.find();

  const attemptNo = examSetting[0]?.exam_frequency || 2;

  if (!payment) {
    return res.status(400).json({ message: "Payment not found" });
  }

  if (payment.exam_attempt_number >= attemptNo) {
    return res.status(400).json({ message: "Exam limit exceded" });
  }

  let paymentStatus = payment.status;

  res.json({ status: paymentStatus });
};

export const checkCurrentPaymentStatus = async (
  req: TransactionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);
    const currentStatus = await transRepo
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.testExams", "testExams")
      .where("transaction.cand_id = :userId", { userId })
      .orderBy("transaction.created_date", "DESC")
      .addOrderBy("testExams.test_date", "DESC")
      .take(1)
      .getOne();
    const examSetting = await examSettingRepo.find();

    const attemptNo = examSetting[0].exam_frequency;

    if (
      (currentStatus && currentStatus.exam_attempt_number >= attemptNo) ||
      (currentStatus?.status === "Done"||"COMPLETE" &&
        currentStatus?.testExams[0]?.test_status === "Pass")
    ) {
      return res.json({
        paymentStatus: "Completed",
        testExamStatus: "Completed",
      });
    }

    return res.json({
      paymentStatus: currentStatus?.status || "Pending",
      testExamStatus: currentStatus?.testExams[0]?.test_status || "Pending",
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};

export const updatePaymentAttemptNo = async (
  req: TransactionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.user.id);

    const payment = await transactionGetByUser(userId);

    const examSetting = await examSettingRepo.find();

    const attemptNo = examSetting[0].exam_frequency;

    if (!payment) {
      return res.status(400).json({ message: "Payment not done" });
    }

    if (payment.exam_attempt_number >= attemptNo) {
      return res.status(400).json({ message: "Exam limit exceded" });
    }

    if (payment.status !== "Done"||"COMPLETE") {
      return res
        .status(400)
        .json({ status: payment.status, message: "Payment not done" });
    }

    const examStatus = payment.testExams[0].test_status;

    if (examStatus === "Pass") {
      return res.status(400).json({ message: "Exam already passed" });
    }

    const updatedPaymentAttempNo = payment.exam_attempt_number + 1;

    const paymentData = await transactionUpdate(payment, {
      exam_attempt_number: updatedPaymentAttempNo,
    });

    res.json({ data: paymentData });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
};
