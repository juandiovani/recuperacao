
import {  Entity,  PrimaryGeneratedColumn,  Column,  ManyToOne,} from "typeorm";

import { User } from "./User";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  title!: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
  })
  user!: User;
}