import { Router } from "express"
import {
  createCountry,
  deleteCountry,
  getCountries,
  updateCountry,
} from "../controllers/country.controller"
import { authUser } from "../middlewares/auth.middleware"

const router = Router()

router.route("/").post(authUser, createCountry).get(authUser, getCountries)
router
  .route("/:id")
  .patch(authUser, updateCountry)
  .delete(authUser, deleteCountry)

export default router
