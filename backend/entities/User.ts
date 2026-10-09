
import {  Entity,  PrimaryGeneratedColumn,  Column,  OneToMany,} from "typeorm";

import { Task } from "./Task";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}