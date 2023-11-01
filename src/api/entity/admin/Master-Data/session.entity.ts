import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Course } from "./course.entity";
import { Topic } from "./topic.entity";

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

  @Column({ name: "description_nepali", type: "text", nullable: true })
  descriptionNepali: string;

  @Column({ name: "session_file" })
  sessionFile: string;

  @ManyToOne(() => Course, (course) => course.session)
  @JoinColumn({ name: "course_id" })
  course: Course;

  @OneToMany(() => Topic, (topic) => topic.session)
  topic: Topic;

  private static imageDir = process.env.IMAGEPATH;

  @AfterLoad()
  pupulateImageUrl() {
    this.sessionFile = Session.imageDir + this.sessionFile;
  }
}
