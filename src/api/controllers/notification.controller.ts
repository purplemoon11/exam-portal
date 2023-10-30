import { Request, Response, NextFunction } from "express"
import {
  notificationCreate,
  notificationGet,
  notificationGetById,
  notificationUpdate,
  notificationDelete,
} from "../services/notification.service"
import { Notification } from "../entity/notification.entity"
import ormConfig from "../../config/ormConfig"
import AppErrorUtil from "../utils/error-handler/appError"
import logger from "../../config/logger"
import env from "../utils/env"

const notificationRepo = ormConfig.getRepository(Notification)

interface UserRequest extends Request {
  user: {
    id: string
  }
}

export const createNotification = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body
    const cand_id = parseInt(req.user.id)

    const notificationData = new Notification()

    notificationData.cand_id = cand_id
    notificationData.title = title
    notificationData.description = description

    const notification = await notificationCreate(notificationData)

    logger.info("Notification created", notification)
    res.status(201).json({
      data: notification,
      message: "Notification created successfully",
    })
  } catch (err) {
    logger.error("Fail to add notification", err)
    res.status(500).send("Internal server error")
  }
}

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await notificationGet()

    res.json({ data: notifications })
  } catch (err) {
    logger.error("Unable to fetch notifications", err)
    res.status(500).send("Internal Server error")
  }
}

export const getNotificationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const notification = await notificationGetById(id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json({ data: notification })
  } catch (err) {
    logger.error("Unable to fetch notification", err)
    res.status(500).send("Internal Server error")
  }
}

export const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)
    const { title, description } = req.body
    const cand_id = parseInt(req.params.id)

    const notificationData = await notificationRepo.findOneBy({
      id,
    })

    if (!notificationData) {
      return res.status(404).json({ message: "Notification data not found" })
    }

    const notification = await notificationUpdate(
      {
        cand_id,
        title,
        description,
      },
      notificationData
    )

    logger.info("Notification updated successfully")
    res.json({
      data: notification,
      message: "Notification updated successfully",
    })
  } catch (err) {
    logger.error("Unable to update notification data", err)
    res.status(500).send("Internal Server error")
  }
}

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id)

    const notificationData = await notificationRepo.findOneBy({
      id,
    })

    if (!notificationData) {
      return res.status(404).json({ message: "Notification data not found" })
    }

    await notificationDelete(id)

    return res.json({ message: "Notification deleted successfully" })
  } catch (err) {
    logger.error("Unable to delete notification data", err)
    res.status(500).send("Internal Server error")
  }
}
