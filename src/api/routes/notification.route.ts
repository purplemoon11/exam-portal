import { Router } from "express"
import {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createNotification)
  .get(authUser, getNotifications)
router
  .route("/:id")
  .get(authUser, getNotificationById)
  .patch(authUser, updateNotification)
  .delete(authUser, deleteNotification)

export default router
