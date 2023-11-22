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

  @Column({ type: "varchar",unique:true })
  name: string;

  @Column({unique:true})
  order: number;

  @Column({ name: "video_path" })
  videoPath: string;

  @ManyToOne(() => Topic, (topic) => topic.videosContent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
