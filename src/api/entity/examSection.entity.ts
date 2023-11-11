import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Cluster } from "./admin/Master-Data/cluster.entity"
import { Country } from "./country.entity"

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

  @Column({ name: "country_id", type: "int" })
  country_id: number

  @ManyToOne(() => Cluster)
  @JoinColumn({ name: "cluster_id" })
  clusterId: Cluster[]

  @ManyToOne(() => Country, country => country.examSection)
  @JoinColumn({ name: "country_id" })
  countryId: Country[]
}
