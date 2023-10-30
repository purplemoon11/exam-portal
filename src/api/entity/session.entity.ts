import { Entity, PrimaryGeneratedColumn, Column, AfterLoad } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar" })
  nameNepali: string;

  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text" })
  descriptionNepali: string;

  @Column({ name: "session_file" })
  sessionFile: string;

  private static imageDir = process.env.IMAGEPATH;

  @AfterLoad()
  pupulateImageUrl() {
    this.sessionFile = Session.imageDir + this.sessionFile;
  }
}
