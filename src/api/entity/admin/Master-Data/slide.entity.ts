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

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  order: string;

  @Column({ name: "slide_path" })
  slidePath: string;

  @ManyToOne(() => Topic, (topic) => topic.slidesContent)
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
