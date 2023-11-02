import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("banner_images")
export class BannerImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", array: true, nullable: true })
  image_urls: string[];
}

@Entity("about_us")
export class AboutUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  content: string;
}
