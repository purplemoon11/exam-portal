import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Topic } from "./topic.entity";
import { Base } from "../../base.entity";

@Entity()
export class Videos extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column()
  order: number;

  @Column({ name: "video_path" })
  videoPath: string;

  @ManyToOne(() => Topic, (topic) => topic.videosContent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "topic_id" })
  topic: Topic;
}
