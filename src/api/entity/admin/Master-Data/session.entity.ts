import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Course } from "./course.entity";
import { Topic } from "./topic.entity";
import { Base } from "../../base.entity";

@Entity()
export class Session extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar", nullable: true })
  nameNepali: string;

  @Column({ type: "varchar", unique: true })
  code: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text", nullable: true })
  descriptionNepali: string;

  @Column({ name: "session_file", nullable: true })
  sessionFile: string;

  @ManyToOne(() => Course, (course) => course.session, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course: Course;

  @OneToMany(() => Topic, (topic) => topic.session, {
    cascade: true,
  })
  topic: Topic;

  // private static imageDir = process.env.IMAGEPATH;

  // // @BeforeUpdate()
  // // @BeforeInsert()
  // @AfterLoad()
  // pupulateImageUrl() {
  //   this.sessionFile = Session.imageDir + this.sessionFile;
  // }
}
