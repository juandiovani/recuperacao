import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";

export const TaskRepository = AppDataSource.getRepository(Task);