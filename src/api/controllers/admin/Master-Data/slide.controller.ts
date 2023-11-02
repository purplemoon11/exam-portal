import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Slide } from "../../../entity/admin/Master-Data/slide.entity";

const topicRepo = ormConfig.getRepository(Topic);
const slideRepo = ormConfig.getRepository(Slide);

export const addVideo = catchAsync(async (req: Request, res: Response) => {
  try {
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });
    const isSlideExist = await slideRepo.findOne({
      where: { order: req.body?.order },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isSlideExist)
      throw new AppErrorUtil(400, "Slide with this order already exist");

    const slideFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newSlide = new Slide();
    newSlide.name = req.body.name;
    newSlide.order = req.body.name;
    newSlide.slidePath = slideFile;
    newSlide.topic = existingTopic;
    const result = await slideRepo.save(newSlide);
    if (!result)
      throw new AppErrorUtil(400, "Unable to add slide,please try again");
    return res
      .status(200)
      .json({ message: "slide file added successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
