import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterLoad,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Session } from "./session.entity";
import { Topic } from "./topic.entity";

@Entity()
export class TopicFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", name: "content_type" })
  contentType: string;

  @Column({ name: "file_order" })
  order: number;

  @Column({ name: "topic_file" })
  file: string;

  @ManyToOne(() => Topic, (topic) => topic.files)
  @JoinColumn({ name: "topic_id" })
  topic: Topic;

  private static imageDir = process.env.IMAGEPATH;

  @AfterLoad()
  pupulateImageUrl() {
    this.file = TopicFiles.imageDir + this.file;
  }
}
