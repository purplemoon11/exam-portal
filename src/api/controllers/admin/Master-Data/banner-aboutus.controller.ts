import { Request, Response } from "express";
import dataSource from "../../../../config/ormConfig";
import {
  AboutUs,
  BannerImage,
} from "../../../entity/admin/Master-Data/banner-aboutus.entity";

export async function createBannerImage(req: Request, res: Response) {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const { title, description } = req.body;

    if (!imageFiles || imageFiles.length === 0) {
      res.status(400).json({ error: "No files uploaded." });
      return;
    }

    const bannerRepository = dataSource.getRepository(BannerImage);
    const createdBanners: BannerImage[] = [];

    for (const file of imageFiles) {
      const image_url = file.path;
      const imagePath = image_url.split("/")[3];
      const fullImagePath = `${req.secure ? "https" : "http"}://${req.get(
        "host"
      )}/medias/${imagePath}`;

      const newBanner = bannerRepository.create({
        image_urls: [fullImagePath], // Assuming image_urls is an array property in BannerImage entity
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
    const imageFiles = req.files as Express.Multer.File[];
    console.log(imageFiles);
    const { title, description } = req.body;
    const id = parseInt(req.params.id, 10);

    const bannerRepository = dataSource.getRepository(BannerImage);
    const existingBanner = await bannerRepository.findOneBy({ id });

    if (!existingBanner) {
      res.status(404).json({ error: "Banner image not found." });
      return;
    }
    if (title) {
      existingBanner.title = title;
    }

    if (description) {
      existingBanner.description = description;
    }
    if (imageFiles && imageFiles.length > 0) {
      const updatedImageURLs = imageFiles.map((file) => {
        const imagePath = file.path.split("/")[3];
        return `${req.secure ? "https" : "http"}://${req.get(
          "host"
        )}/medias/${imagePath}`;
      });
      existingBanner.image_urls = updatedImageURLs;
    }
    const updatedBanner = await bannerRepository.save(existingBanner);

    res.status(200).json({
      message: "Banner image updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
