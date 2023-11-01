import {
  AboutUs,
  BannerImage,
} from "../entity/admin/Master-Data/banner-aboutus.entity";
import dataSource from "../../config/ormConfig";
import { Request, Response } from "express";

export async function getAboutUs(req: Request, res: Response): Promise<void> {
  try {
    const aboutUsRepository = dataSource.getRepository(AboutUs);
    const aboutUs = await aboutUsRepository.find();
    if (aboutUs) {
      res.status(200).json({ content: aboutUs });
    } else {
      res.status(404).json({ error: "About Us section not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getBanners(req: Request, res: Response): Promise<void> {
  try {
    const bannerRepository = dataSource.getRepository(BannerImage);
    const banners = await bannerRepository.find();
    res.status(200).json({ banners });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
