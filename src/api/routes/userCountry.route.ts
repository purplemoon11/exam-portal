import { Router } from "express"
import {
  createUserCountry,
  getUserCountries,
  getUserCountryById,
  updateUserCountry,
  deleteUserCountry,
} from "../controllers/userCountry.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router
  .route("/")
  .post(authUser, createUserCountry)
  .get(authUser, getUserCountries)
router
  .route("/:id")
  .get(authUser, getUserCountryById)
  .patch(authUser, updateUserCountry)
  .delete(authUser, deleteUserCountry)

export default router
