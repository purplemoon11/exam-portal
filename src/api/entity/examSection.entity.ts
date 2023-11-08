import { Cluster } from "ioredis"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm"

@Entity("exam_section")
export class ExamSection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "name", type: "varchar" })
  name: string

  @Column({ name: "cluster_id", type: "int" })
  cluster_id: number

  @Column({ name: "no_questions", type: "int" })
  noOfQuestions: number

  @ManyToOne(() => Cluster)
  @JoinColumn({ name: "cluster_id" })
  clusterId: Cluster[]
}
