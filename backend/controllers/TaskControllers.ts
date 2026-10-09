import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";

export class TaskControllers {
  private taskService = new TaskService();

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const tasks = await this.taskService.list();

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar tarefas.",
      });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID inválido.",
        });
      }

      const task = await this.taskService.findById(id);

      if (!task) {
        return res.status(404).json({
          message: "Tarefa não encontrada.",
        });
      }

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar tarefa.",
      });
    }
  }
}