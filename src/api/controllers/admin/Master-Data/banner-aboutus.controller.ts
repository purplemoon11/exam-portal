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
    const baseUrl = process.env.UPLOADS_BASE_URL || "http://localhost:3000/"; // Base URL for image hosting

    if (!imageFiles || imageFiles.length === 0) {
      res.status(400).json({ error: "No files uploaded." });
      return;
    }

    const bannerRepository = dataSource.getRepository(BannerImage);
    const createdBanners: BannerImage[] = [];

    for (const file of imageFiles) {
      const imagePath = file.path;
      const fullImagePath = baseUrl + imagePath;
      const newBanner = bannerRepository.create({
        imagePath: fullImagePath,
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
    const id: number = parseInt(req.params.id, 10); // Extract the id from URL params
    const findOptions: FindOneOptions<BannerImage> = {
      where: { id: id },
    };
    const baseUrl = process.env.UPLOADS_BASE_URL || "http://localhost:3000/"; // Base URL for image hosting

    const bannerRepository = dataSource.getRepository(BannerImage);
    const bannerToUpdate = await bannerRepository.findOne(findOptions);

    if (!bannerToUpdate) {
      res.status(404).json({ error: "Banner image not found." });
      return;
    }

    bannerToUpdate.title = title;
    bannerToUpdate.description = description;

    if (req.file) {
      // If a new image is uploaded, update the imagePath property
      const imagePath = path.join("uploads/", req.file.filename);
      bannerToUpdate.imagePath = `${baseUrl}${imagePath}`;
    }

    const updatedBanner = await bannerRepository.save(bannerToUpdate);

    // Delete the previous image file if it exists
    if (req.file && bannerToUpdate.imagePath) {
      const previousImagePath = path.join(
        "uploads/",
        path.basename(bannerToUpdate.imagePath)
      );
      fs.unlinkSync(previousImagePath);
    }

    // Modify the response object to include the full image path
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
