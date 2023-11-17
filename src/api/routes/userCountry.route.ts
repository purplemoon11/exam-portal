import { Router } from "express"
import {
  createUserCountry,
  getUserCountries,
  getUserCountryById,
  updateUserCountry,
  deleteUserCountry,
  getLatestUserCountry,
} from "../controllers/userCountry.controller"

const router = Router()

router.route("/").post(createUserCountry).get(getUserCountries)
router
  .route("/:id")
  .get(getUserCountryById)
  .patch(updateUserCountry)
  .delete(deleteUserCountry)
router.route("/latest/data").get(getLatestUserCountry)

export default router
