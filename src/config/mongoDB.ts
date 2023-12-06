import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

export async function connectToMongoDB() {
  try {
    // const connectionOptions:ConnectOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    // };
    const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
    const connectionUri = `mongodb://${process.env.MONGO_USER}:${encodedPassword}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`;
    console.log(connectionUri);
    const result = await mongoose.connect(connectionUri);
    logger.info("MongoDB connected successfully");

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
