import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("banner_images")
export class BannerImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  image_url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;
}

@Entity("about_us")
export class AboutUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  content: string;
}
