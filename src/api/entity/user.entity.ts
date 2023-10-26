import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class User extends Base {
  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: false, unique: true })
  passport: string;

  @Column()
  otpVerified: string;

  @Column()
  email: string;

  @Column({ nullable: false })
  password: string;
}
