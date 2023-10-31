import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Country } from "./country.entity"

@Entity("cluster", { schema: "public" }) // Specify the schema if needed
export class Cluster {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 256 })
  cluster_name: string

  @Column({ type: "varchar", length: 20 })
  cluster_code: string

  @Column({ type: "integer" })
  country_id: number

  @Column({ type: "varchar", length: 256 })
  description: string

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country: Country
}
