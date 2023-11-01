import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("banner_images")
export class BannerImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  imagePath: string;
}

@Entity("about_us")
export class AboutUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  content: string;
}
