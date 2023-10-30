import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  AfterLoad,
} from "typeorm";
import { Country } from "./country.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar" })
  nameNepali: string;

  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "interval" })
  duration: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text" })
  descriptionNepali: string;

  @Column({ name: "course_file" })
  courseFile: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country: Country;

  private static imageDir = process.env.IMAGEPATH;

  @AfterLoad()
  pupulateImageUrl() {
    this.courseFile = Course.imageDir + this.courseFile;
  }
}
