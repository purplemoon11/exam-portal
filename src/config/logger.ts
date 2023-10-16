import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

/**
 * log result
 */
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

/**
 * transport for rotating log files
 */
const transport: DailyRotateFile = new DailyRotateFile({
  filename: "./logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "info",
  maxSize: "20m",
});

const errorTransport: DailyRotateFile = new DailyRotateFile({
  filename: "./logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
});

/**
 * logger instance
 */
const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [transport, errorTransport, new winston.transports.Console()],
});

export default logger;
