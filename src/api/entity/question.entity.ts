import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Cluster } from "./cluster.entity"

@Entity("exam_question", { schema: "public" })
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "question_text", type: "varchar" })
  question_text: string

  @Column({ name: "media_file", type: "varchar" })
  media_file: string

  @ManyToOne(() => Cluster)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster
}
