import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar usuários.",
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

      const user = await UserRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar usuário.",
      });
    }
  }

  
}