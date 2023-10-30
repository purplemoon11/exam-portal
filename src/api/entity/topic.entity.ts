import { Entity, PrimaryGeneratedColumn, Column, AfterLoad } from "typeorm";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar" })
  nameNepali: string;

  @Column({ type: "varchar", name: "content_type" })
  contentType: string;

  @Column({ type: "varchar", name: "file_name" })
  fileName: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text" })
  descriptionNepali: string;

  @Column({ name: "topic_file" })
  topicFile: string;

  private static imageDir = process.env.IMAGEPATH;

  @AfterLoad()
  pupulateImageUrl() {
    this.topicFile = Topic.imageDir + this.topicFile;
  }
}
