import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST, // Redis server host
  port: Number(process.env.REDIS_PORT), // Redis server port
});

export default redisClient;
