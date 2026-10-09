
import { Router } from "express";
import { UserController } from "../controllers/UserControllers";
import { TaskControllers } from "../controllers/TaskControllers";

const routes = Router();

const userController = new UserController();
const taskController = new TaskControllers();

routes.get("/users", (req, res) =>
  userController.list(req, res)
);

routes.get("/users/:id", (req, res) =>
  userController.findById(req, res)
);

routes.get("/tasks", (req, res) =>
  taskController.list(req, res)
);

routes.get("/tasks/:id", (req, res) =>
  taskController.findById(req, res)
);

export default routes;