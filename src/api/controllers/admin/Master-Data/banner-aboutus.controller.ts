import { Request, Response } from "express";
import dataSource from "../../../../config/ormConfig";
import {
  AboutUs,
  BannerImage,
} from "../../../entity/admin/Master-Data/banner-aboutus.entity";
import path from "path";
import fs from "fs";
import { FindOneOptions } from "typeorm";

export async function createBannerImage(req: Request, res: Response) {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const { title, description } = req.body;
    const baseUrl = process.env.UPLOADS_BASE_URL;

    if (!imageFiles || imageFiles.length === 0) {
      res.status(400).json({ error: "No files uploaded." });
      return;
    }

    const bannerRepository = dataSource.getRepository(BannerImage);
    const createdBanners: BannerImage[] = [];

    for (const file of imageFiles) {
      const image_url = file.path;
      const fullImagePath = baseUrl + image_url;
      const newBanner = bannerRepository.create({
        image_url: fullImagePath,
        title,
        description,
      });
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

export async function deleteBannerImage(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    const bannerRepository = dataSource.getRepository(BannerImage);
    const bannerToDelete = await bannerRepository.findOneBy({
      id: parseInt(id, 10),
    });

    if (!bannerToDelete) {
      res.status(404).json({ error: "Banner image not found." });
      return;
    }

    await bannerRepository.remove(bannerToDelete);
    res.status(200).json({ message: "Banner image deleted successfully" });
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

export async function updateBannerImage(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    const id: number = parseInt(req.params.id, 10);
    const findOptions: FindOneOptions<BannerImage> = {
      where: { id: id },
    };
    const baseUrl = process.env.UPLOADS_BASE_URL;

    const bannerRepository = dataSource.getRepository(BannerImage);
    const bannerToUpdate = await bannerRepository.findOne(findOptions);

    if (!bannerToUpdate) {
      res.status(404).json({ error: "Banner image not found." });
      return;
    }

    bannerToUpdate.title = title;
    bannerToUpdate.description = description;

    if (req.file) {
      const imagePath = path.join("uploads/", req.file.filename);
      bannerToUpdate.image_url = `${baseUrl}${imagePath}`;
    }

    const updatedBanner = await bannerRepository.save(bannerToUpdate);
    if (req.file && bannerToUpdate.image_url) {
      const previousImagePath = path.join(
        "uploads/",
        path.basename(bannerToUpdate.image_url)
      );
      fs.unlinkSync(previousImagePath);
    }
    const responseBanner: any = { ...updatedBanner };
    if (responseBanner.imagePath) {
      responseBanner.imagePath = `${baseUrl}${responseBanner.imagePath}`;
    }

    res.status(200).json({
      message: "Banner image updated successfully",
      banner: responseBanner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
