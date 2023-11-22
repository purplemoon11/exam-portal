import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Topic } from "./topic.entity";

@Entity()
export class Slide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ unique: true })
  order: number;

  @Column({ name: "slide_path" })
  slidePath: string;

  @ManyToOne(() => Topic, (topic) => topic.slidesContent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
