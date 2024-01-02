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
import { Base } from "../../base.entity";

@Entity()
export class Pdf extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column()
  order: number;

  @Column({ name: "pdf_path" })
  pdfPath: string;

  @ManyToOne(() => Topic, (topic) => topic.pdfContent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
