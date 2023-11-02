import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Pdf } from "../../../entity/admin/Master-Data/pdf.entity";

const topicRepo = ormConfig.getRepository(Topic);
const pdfRepo = ormConfig.getRepository(Pdf);

export const addVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });
    const isPdfExist = await pdfRepo.findOne({
      where: { order: req.body?.order },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isPdfExist)
      throw new AppErrorUtil(400, "Pdf with this order already exist");

    const pdfFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newPdf = new Pdf();
    newPdf.name = req.body.name;
    newPdf.order = req.body.name;

    newPdf.pdfPath = pdfFile;
    newPdf.topic = existingTopic;
    const result = await pdfRepo.save(newPdf);
    if (!result)
      throw new AppErrorUtil(400, "Unable to add pdf file,please try again");
    return res
      .status(200)
      .json({ message: " Pdf file added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
