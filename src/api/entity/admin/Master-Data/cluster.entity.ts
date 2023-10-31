import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Country } from "../../country.entity";

@Entity({ name: "cluster" })
export class Cluster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, nullable: true })
  cluster_name: string;

  @Column({ length: 20, nullable: true })
  cluster_code: string;

  @Column({ length: 256, nullable: true })
  description: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country: Country;
}
