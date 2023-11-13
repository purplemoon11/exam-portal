import { Request, Response } from "express";
import ormConfig from "../../../../config/ormConfig";
import { Topic } from "../../../entity/admin/Master-Data/topic.entity";
import { catchAsync } from "../../../utils/error-handler/catchAsync";
import { Videos } from "../../../entity/admin/Master-Data/videos.entity";
import AppErrorUtil from "../../../utils/error-handler/appError";
import { Pdf } from "../../../entity/admin/Master-Data/pdf.entity";
import { MoreThanOrEqual } from "typeorm";

const topicRepo = ormConfig.getRepository(Topic);
const pdfRepo = ormConfig.getRepository(Pdf);

export const addPdf = catchAsync(async (req: Request, res: Response) => {
  try {
    const { topicId } = req.body;
    let existingTopic: Topic;
    topicId
      ? (existingTopic = await topicRepo.findOneBy({ id: topicId }))
      : null;
    const isPdfOrderExist = await pdfRepo.findOne({
      where: { order: req.body?.order },
    });
    const isPdfNameExist = await pdfRepo.findOne({
      where: { name: req.body?.name },
    });
    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    if (isPdfOrderExist)
      throw new AppErrorUtil(400, "Pdf with this order already exist");
    if (isPdfNameExist)
      throw new AppErrorUtil(40, "Pdf with this name already exist");
    const pdfFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const newPdf = new Pdf();
    newPdf.name = req.body.name;
    newPdf.order = req.body.order;

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

export const updatePdf = catchAsync(async (req: Request, res: Response) => {
  try {
    const pdfId = +req.params.id;
    const newOrder = +req.body.order;
    const existingTopic = await topicRepo.findOneBy({ id: req.body?.topicId });

    if (!existingTopic) throw new AppErrorUtil(400, "Unable to find topic");
    const isNameInUse = await pdfRepo
      .createQueryBuilder("pdf")
      .where("pdf.name = :name AND pdf.id != :pdfId", {
        name: req.body.name,
        pdfId: pdfId,
      })
      .getOne();
    if (isNameInUse)
      throw new AppErrorUtil(400, "Pdf with this name already exist");

    const existingPdf = await pdfRepo.findOneBy({ id: pdfId });
    if (!existingPdf) {
      throw new AppErrorUtil(400, "pdf not found");
    }
    const pdfFile = `${req.secure ? "https" : "http"}://${req.get(
      "host"
    )}/medias/${req.file?.filename}`;
    const isPdfWithSameOrderExist = await pdfRepo.findOneBy({
      order: newOrder,
    });

    if (newOrder !== existingPdf.order && isPdfWithSameOrderExist) {
      const pdfAfterSameOrder = await pdfRepo.find({
        where: { order: MoreThanOrEqual(newOrder) },
        order: { order: "ASC" },
      });

      // Update the order of the current pdf
      existingPdf.order = newOrder;
      existingPdf.name = req.body.name;
      existingPdf.pdfPath = pdfFile;
      existingPdf.topic = existingTopic;

      // Increment the order of other pdfs with the same order
      let incrementOrder = newOrder + 1;
      for (const pdf of pdfAfterSameOrder) {
        if (pdf.id !== pdfId) {
          pdf.order = incrementOrder;
          incrementOrder++;
          await pdfRepo.save(pdf);
        }
      }
    } else {
      existingPdf.order = newOrder;
      existingPdf.name = req.body.name;

      existingPdf.pdfPath = pdfFile;
      existingPdf.topic = existingTopic;
    }

    const result = await pdfRepo.save(existingPdf);
    if (!result)
      throw new AppErrorUtil(400, "Unable to update pdf,please try again");
    return res
      .status(200)
      .json({ message: "Pdf updated successfully", result });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});

export const deletePdf = catchAsync(async (req: Request, res: Response) => {
  try {
    const pdfId = +req.params.id;
    const existingPdf = await pdfRepo.findOneBy({ id: pdfId });

    if (!existingPdf) {
      throw new AppErrorUtil(404, "Pdf not found");
    }

    await pdfRepo.remove(existingPdf);

    return res.status(200).json({ message: "Pdf deleted" });
  } catch (err) {
    throw new AppErrorUtil(400, err.message);
  }
});
