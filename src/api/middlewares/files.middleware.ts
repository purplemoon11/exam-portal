import { Request } from "express"
import multer, { StorageEngine } from "multer"
import path from "path"
import AppErrorUtil from "../utils/error-handler/appError"

interface MulterFile extends Express.Multer.File {
  size: number
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"))
  },
  // Modify the filename if needed
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "").replace(".", "") +
        "_" +
        file.originalname
    )
  },
})

const fileFilter = (req: Request, file: MulterFile, cb: any) => {
  //reject a file
  if (+req?.headers?.["content-length"]! > 1024 * 1024 * 30) {
    return cb(
      new AppErrorUtil(400, "File size exceeds the limit of 30MB"),
      false
    )
  }
  const allowedMimetypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-flv",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ]

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppErrorUtil(400, "Wrong file type"), false)
  }
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 30, // 1MB
  },
  fileFilter: fileFilter,
})
