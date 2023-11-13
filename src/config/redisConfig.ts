import { Redis } from "ioredis"

export const redisClient = new Redis({
  host: "localhost",
  port: Number(process.env.REDIS_PORT),
})

export const getAsync = (key: any) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

export const setAsync = (key: any, value: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    redisClient.set(key, value, err => {
      if (err) reject(err)
      resolve()
    })
  })
}

export const delAsync = (key: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    redisClient.del(key, err => {
      if (err) reject(err)
      resolve()
    })
  })
}
