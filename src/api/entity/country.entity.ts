import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { UserCountry } from "./userCountry.entity"
import { Cluster } from "./admin/Master-Data/cluster.entity"
import { ExamSection } from "./examSection.entity"

@Entity("country")
export class Country {
  forEach(arg0: (country: any) => void) {
    throw new Error("Method not implemented.")
  }
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ name: "cluster_id", type: "int" })
  cluster_id?: string

  @Column({ name: "country_name", type: "varchar" })
  country_name?: string

  @Column({ name: "contact_person", type: "varchar" })
  contact_person?: string

  @Column({ name: "phone_number", type: "varchar" })
  phone_number?: string

  @Column({ name: "embassy_phone_number", type: "varchar" })
  embassy_ph_number?: string

  @Column({ name: "image", type: "varchar" })
  media_file?: string

  @Column({ name: "embassy_address", type: "varchar" })
  embassy_address?: string

  @Column({ name: "file_type", type: "varchar", default: "Others" })
  fileType: string

  @OneToMany(() => UserCountry, country => country)
  public userCountry?: UserCountry[]

  @OneToMany(() => ExamSection, country => country.countryId)
  public examSection: ExamSection[]

  @ManyToOne(() => Cluster, cluster => cluster.countries)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster
}
