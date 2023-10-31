import { Router } from "express"
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from "../controllers/country.controller"
import { authUser } from "../middlewares/auth.middleware"
import { MediaUpload } from "../utils/multer"

const router = Router()

const uploadCountryImage = MediaUpload.fields([
  {
    name: "image",
    maxCount: 1,
  },
])

router
  .route("/")
  .post(authUser, uploadCountryImage, createCountry)
  .get(authUser, getCountries)
router
  .route("/:id")
  .get(authUser, getCountryById)
  .patch(authUser, uploadCountryImage, updateCountry)
  .delete(authUser, deleteCountry)

export default router
