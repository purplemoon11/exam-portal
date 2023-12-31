import axios from "axios";
import { Request, Response } from "express";
import crypto from "crypto";
import { logPaymentData } from "../../config/mongoDB";


export const paymentInitiation = async (req: Request, res: Response) => {
  try {
    const payload = {
      return_url: "https://www.google.com/",
      website_url: "http://202.166.198.129:4510/",
      amount: 100000,
      purchase_order_id: crypto.randomBytes(4).toString("hex"),
      purchase_order_name: "exam_portal_test",
    };


    await logPaymentData({
      type: "paymentInitiationRequest",
      timestamp: new Date(),
      payload,
    });

    const result = await axios.post(process.env.INITIATION_API!, payload, {
      headers: {
        Authorization: `key live_secret_key_${process.env.KHALTI_SECRET!}`,
        "Content-Type": "application/json",
      },
    });


    await logPaymentData({
      type: "paymentInitiationResponse",
      timestamp: new Date(),
      response: result.data,
    });

    return res
      .status(201)
      .json({ message: "Payment initiated successfully", data: result.data });
  } catch (err: any) {
    // Log the error if payment initiation fails
    await logPaymentData({
      type: "paymentInitiationError",
      timestamp: new Date(),
      error: err.message,
    });

    console.error("Error on initiating payment:", err.message);

    return res
      .status(500)
      .json({ message: `Error on initiating payment: ${err.message}` });
  }
};





export const paymentVerification = async (req: Request, res: Response) => {
  try {
    const clientpidx = req.body.pidx || req.query.pidx;

    if (!clientpidx) {
      return res.status(400).json({ message: "Missing pidx in the request" });
    }

    const payload = {
      pidx: clientpidx,
    };

    const result = await axios.post(process.env.VERIFY_URL!, payload, {
      headers: {
        Authorization: `key live_secret_key_${process.env.KHALTI_SECRET!}`,
        "Content-Type": "application/json",
      },
    });

    console.log("result data:", result.data);

    
      return res
        .status(200)
        .json({ message: "Payment verified successfully", data: result.data });
   

  } catch (err: any) {
    return res
      .status(400)
      .json({ message: `Error on initiating payment: ${err.message}` });
  }
};


// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     ManyToOne,
//     JoinColumn,
//     OneToMany,
//     Inheritance,
//     DiscriminatorColumn,
//   } from "typeorm";
//   import { User } from "./user.entity";
//   import { TestExamination } from "./testExamination.entity";

//   export enum ETransactionSource {
//     WEB = "web",
//     MOBILE = "mobile",
//     GATEWAY1 = "gateway1",
//     GATEWAY2 = "gateway2",
//   }

//   @Entity("transaction_log")
//   @Inheritance({ strategy: "single-table" })
//   @DiscriminatorColumn({ name: "gateway_type", type: "varchar" })
//   export abstract class Payment {
//     @PrimaryGeneratedColumn()
//     payment_id?: number;

//     @Column({ type: "integer" })
//     cand_id?: number;

//     @Column({ name: "transaction_code", type: "varchar", nullable: true })
//     transaction_code: string;

//     @Column({ name: "total_amount", type: "varchar" })
//     total_amount?: string;

//     @Column({ name: "transaction_uuid", type: "varchar" })
//     transaction_uuid?: string;

//     @Column({ name: "product_code", type: "varchar", nullable: true })
//     product_code?: string;

//     @Column({ name: "status", type: "varchar", default: "Pending" })
//     status?: string;

//     @Column({ name: "created_date", type: "timestamp", default: new Date() })
//     created_date?: Date;

//     @Column({ name: "exam_attempt_number", type: "int", default: 0 })
//     exam_attempt_number: number;

//     @Column({
//       name: "transaction_source",
//       type: "enum",
//       enum: ETransactionSource,
//       default: ETransactionSource.WEB,
//     })
//     transactionSource: string;

//     @Column({ name: "product_id", nullable: true })
//     productId: string;

//     @Column({ name: "ref_id", nullable: true })
//     refId: string;

//     @ManyToOne(() => User, (userAuth) => userAuth.otps)
//     @JoinColumn({ name: "cand_id" })
//     candAuth?: User;

//     @OneToMany(() => TestExamination, (testExam) => testExam.payment)
//     testExams: TestExamination;
//   }

//   @Entity("second_gateway_transaction")
//   export class SecondGatewayTransaction extends Payment {
//     @Column({ name: "second_gateway_field", type: "varchar" })
//     secondGatewayField: string;
//   }
