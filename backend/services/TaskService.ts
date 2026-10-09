import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
  async list() {
    return await TaskRepository.find({
      relations: ["user"],
    });
  }

  async findById(id: number) {
    return await TaskRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }
}