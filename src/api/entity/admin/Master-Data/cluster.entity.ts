import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Country } from "../../country.entity";
import { ExamQuestion } from "../../question.entity";

@Entity("cluster", { schema: "public" })
export class Cluster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 256 })
  cluster_name: string;

  @Column({ type: "varchar", length: 20 })
  cluster_code: string;

  @Column({ type: "integer" })
  country_id: number;

  @Column({ type: "varchar", length: 256 })
  description: string;

  @OneToMany(() => Country, (country) => country.cluster)
  country: Country[];

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.cluster, {
    cascade: true,
  })
  examQuestions: ExamQuestion[];
}
