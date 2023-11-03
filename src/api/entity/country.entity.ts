import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserCountry } from "./userCountry.entity";
import { Cluster } from "./admin/Master-Data/cluster.entity";

@Entity("country")
export class Country {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "country_name", type: "varchar" })
  country_name?: string;

  @Column({ name: "contact_person", type: "varchar" })
  contact_person?: string;

  @Column({ name: "phone_number", type: "varchar" })
  phone_number?: string;

  @Column({ name: "embassy_phone_number", type: "varchar" })
  embassy_ph_number?: string;

  @Column({ name: "image", type: "varchar" })
  media_file?: string;

  @Column({ name: "embassy_address", type: "varchar" })
  embassy_address?: string;

  @OneToMany(() => UserCountry, (country) => country)
  public userCountry?: UserCountry[];

  @ManyToOne(() => Cluster, (cluster) => cluster.countries)
  @JoinColumn({ name: "cluster_id" })
  cluster: Cluster;
}
