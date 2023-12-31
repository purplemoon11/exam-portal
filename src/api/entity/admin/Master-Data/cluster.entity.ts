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

  @Column({ type: "varchar", length: 256, unique: true })
  cluster_name: string;

  @Column({ type: "varchar", length: 20, unique: true })
  cluster_code: string;

  @Column({ type: "varchar", length: 256 })
  description: string;

  @Column({ default: false })
  isGeneral: boolean;

  @OneToMany(() => Country, (country) => country.cluster)
  countries: Country[];

  @Column({ name: "country_id", type: "integer", nullable: true }) // Add this line
  country_id: number;

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.cluster, {
    cascade: true,
  })
  examQuestions: ExamQuestion[];
}
