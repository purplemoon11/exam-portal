import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Country } from "./country.entity"

@Entity("user_country")
export class UserCountry {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: "integer", nullable: true })
  country_id?: number

  @Column({ type: "integer", nullable: true })
  cand_id?: number

  @Column({ type: "timestamp", default: new Date() })
  date?: Date

  @ManyToOne(() => Country, userCountry => userCountry.userCountry)
  @JoinColumn({ name: "country_id" })
  country?: Country

  @ManyToOne(() => User)
  @JoinColumn({ name: "cand_id" })
  candidate?: User
}
