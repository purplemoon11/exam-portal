import { Router } from "express"
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from "../controllers/country.controller"
import { FileUpload } from "../utils/multer"
import { isAdmin } from "../middlewares/isAdmin.middleware"

const router = Router()

const uploadCountryImage = FileUpload.fields([
  {
    name: "media_file",
    maxCount: 1,
  },
])

router
  .route("/")
  .post(isAdmin, uploadCountryImage, createCountry)
  .get(getCountries)
router
  .route("/:id")
  .get(getCountryById)
  .patch(isAdmin, uploadCountryImage, updateCountry)
  .delete(deleteCountry)

export default router
