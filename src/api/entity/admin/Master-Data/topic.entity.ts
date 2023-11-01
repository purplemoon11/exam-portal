import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Session } from "./session.entity";
import { TopicFiles } from "./topicFiles.entity";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name_english", type: "varchar" })
  nameEnglish: string;

  @Column({ name: "name_nepali", type: "varchar" })
  nameNepali: string;

  @Column({ type: "text", name: "description_english" })
  descriptionEnglish: string;

  @Column({ name: "description_nepali", type: "text", nullable: true })
  descriptionNepali: string;

  @OneToMany(() => TopicFiles, (file) => file.topic)
  files: TopicFiles;

  @ManyToOne(() => Session, (session) => session.topic)
  @JoinColumn({ name: "session_id" })
  session: Session;
}
