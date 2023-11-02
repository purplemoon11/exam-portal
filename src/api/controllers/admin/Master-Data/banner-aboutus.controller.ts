import { Request, Response } from "express";
import dataSource from "../../../../config/ormConfig";
import {
  AboutUs,
  BannerImage,
} from "../../../entity/admin/Master-Data/banner-aboutus.entity";

export async function createBannerImage(req: Request, res: Response) {
  try {
    const imageFiles = req.files as Express.Multer.File[]; // Use req.files to get uploaded files

    if (!imageFiles || imageFiles.length === 0) {
      res.status(400).json({ error: "No files uploaded." });
      return;
    }

    const bannerRepository = dataSource.getRepository(BannerImage);
    const createdBanners: BannerImage[] = [];

    for (const file of imageFiles) {
      const imagePath = file.path; // File path in the server where the uploaded file is stored
      const newBanner = bannerRepository.create({ imagePath });
      const createdBanner = await bannerRepository.save(newBanner);
      createdBanners.push(createdBanner);
    }

    res.status(201).json({
      message: "Banner images created successfully",
      banners: createdBanners,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateAboutUs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { content } = req.body;

    const aboutUsRepository = dataSource.getRepository(AboutUs);
    const existingAboutUs = await aboutUsRepository.findOne({
      where: { id: 1 },
    });
    if (existingAboutUs) {
      existingAboutUs.content = content;
      await aboutUsRepository.save(existingAboutUs);
    } else {
      const newAboutUs = aboutUsRepository.create({ content });
      await aboutUsRepository.save(newAboutUs);
    }

    res
      .status(200)
      .json({ message: "About us section updated successfully", content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
