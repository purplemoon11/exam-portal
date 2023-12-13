import { Redis } from "ioredis";
import { createClient } from "redis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
// export const client = createClient();
// client.on("connect", () => {
//   console.log("Connected to Redis");
// });
// client.on("error", (err) => {
//   console.log("Cannot connect to Redis Server", err);
// });
// client.connect();

// redisClient.on("error", (err) => {
//   console.error(`Redis Error: ${err}`);
// });

export const getAsync = (key: any) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const setAsync = (key: any, value: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    redisClient.set(key, value, (err, data: any) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const delAsync = (key: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    redisClient.del(key, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
