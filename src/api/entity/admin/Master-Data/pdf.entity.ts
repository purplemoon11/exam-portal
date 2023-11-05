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
export class Pdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  order: number;

  @Column({ name: "pdf_path" })
  pdfPath: string;

  @ManyToOne(() => Topic, (topic) => topic.pdfContent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
