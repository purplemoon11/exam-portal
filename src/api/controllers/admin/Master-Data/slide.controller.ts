import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Slide } from "../../../entity/admin/Master-Data/slide.entity";
import { MoreThanOrEqual } from "typeorm";

const topicRepo = ormConfig.getRepository(Topic);
const slideRepo = ormConfig.getRepository(Slide);

export const addSlide = catchAsync(async (req: Request, res: Response) => {
  try {
    const { topicId, order } = req.body;

    let existingTopic: Topic;
    topicId
      ? (existingTopic = await topicRepo.findOneBy({ id: topicId }))
      : null;
    // console.log(existingTopic);
    const isSlideOrderExist = await slideRepo.findOne({
      where: { order: req.body?.order },
    });
    const isSlideNameExist = await slideRepo.findOne({
      where: { name: req.body?.name },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isSlideNameExist)
      throw new AppErrorUtil(40, "Slide with this name already exist");
    const slideFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    if (isSlideOrderExist) {
      // If the order is taken, adjust the order for this slide and others
      const slidesAfterSameOrder = await slideRepo.find({
        where: { order: MoreThanOrEqual(order) },
        order: { order: "ASC" },
      });

      let incrementOrder: number = +order + 1;

      for (const slide of slidesAfterSameOrder) {
        slide.order = incrementOrder;
        await slideRepo.save(slide);
        incrementOrder++;
      }
    }
    const newSlide = new Slide();
    newSlide.name = req.body.name;
    newSlide.order = req.body.order;
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

export const updateSlide = catchAsync(async (req: Request, res: Response) => {
  try {
    const slideId = +req.params.id;
    const newOrder = +req.body.order;
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });

    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    const isNameInUse = await slideRepo
      .createQueryBuilder("slide")
      .where("slide.name = :name AND slide.id != :slideId", {
        name: req.body.name,
        slideId: slideId,
      })
      .getOne();
    if (isNameInUse)
      throw new AppErrorUtil(400, "Slide with this name already exist");

    const existingSlide = await slideRepo.findOneBy({ id: slideId });
    if (!existingSlide) {
      throw new AppErrorUtil(400, "Slide not found");
    }
    const slideFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const isSlideWithSameOrderExist = await slideRepo.findOneBy({
      order: newOrder,
    });

    if (newOrder !== existingSlide.order && isSlideWithSameOrderExist) {
      const slideAfterSameOrder = await slideRepo.find({
        where: { order: MoreThanOrEqual(newOrder) },
        order: { order: "ASC" },
      });
      console.log("testSlide", slideAfterSameOrder);

      // Update the order of the current slide
      existingSlide.order = newOrder;
      existingSlide.name = req.body.name;
      existingSlide.slidePath = slideFile;
      existingSlide.topic = existingTopic;

      // Increment the order of other pdfs with the same order
      let incrementOrder = newOrder + 1;
      for (const slide of slideAfterSameOrder) {
        if (slide.id !== slideId) {
          slide.order = incrementOrder;
          incrementOrder++;
          await slideRepo.save(slide);
        }
      }
    } else {
      existingSlide.order = newOrder;
      existingSlide.name = req.body.name;

      existingSlide.slidePath = slideFile;
      existingSlide.topic = existingTopic;
    }

    const result = await slideRepo.save(existingSlide);
    if (!result)
      throw new AppErrorUtil(400, "Unable to update slide,please try again");
    return res
      .status(200)
      .json({ message: "Slide updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const deleteSlide = catchAsync(async (req: Request, res: Response) => {
  try {
    const slideId = +req.params.id;
    const existingSlide = await slideRepo.findOneBy({ id: slideId });

    if (!existingSlide) {
      throw new AppErrorUtil(404, "Slide not found");
    }

    await slideRepo.remove(existingSlide);

    return res.status(200).json({ message: "Slide deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
