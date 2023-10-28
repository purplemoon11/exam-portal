import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserManagement {
  @PrimaryGeneratedColumn()
  id: number;
}
