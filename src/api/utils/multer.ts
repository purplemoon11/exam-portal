import multer from "multer";
import { v4 as uuid } from "uuid";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/api/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `img-${uuid()}-${Date.now()}.${ext}`);
  },
});

const multerFilter = function (
  req: any,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void
) {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video") ||
    file.mimetype.startsWith("application")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const FileUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
