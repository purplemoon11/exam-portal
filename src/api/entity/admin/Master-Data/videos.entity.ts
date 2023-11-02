import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Topic } from "./topic.entity";

@Entity()
export class Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  order: string;

  @Column({ name: "video_path" })
  videoPath: string;

  @ManyToOne(() => Topic, (topic) => topic.videosContent)
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
