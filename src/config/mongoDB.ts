import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

export async function connectToMongoDB() {
  try {
    const result = await mongoose.connect(process.env.MONGO_URL);
    if (result) {
      logger.info("MongoDB connected successfully");
    }
    // const db = mongoose.connection.db;
    // await db
    //   .collection("payment_logs")
    //   .insertOne({ type: "paymentRequest", timestamp: new Date() });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export async function logPaymentData(data: any) {
  try {
    const db = mongoose.connection.db;

    // const database = client.db('<your-database-name>');
    const collection = db.collection("payment_logs");

    // const logEntry = {
    //   type: "paymentRequest",
    //   timestamp: new Date(),
    //   data: data,
    // };

    await collection.insertOne(data);
    console.log("Payment request logged:", data);
  } catch (error) {
    console.error("Error logging payment request:", error);
  }
}
