import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TopicFileType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", name: "content_type" })
  contentType: string;

  @Column({ type: "varchar" })
  order: string;
}
