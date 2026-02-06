import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

export class TaskController {
  create = async (req: Request, res: Response) => {
    const dto = createTaskSchema.parse(req.body);
    const task = await taskService.create(dto);
    res.status(201).json(task);
  };

  list = async (req: Request, res: Response) => {
    const query = listTasksSchema.parse(req.query);
    const result = await taskService.list({
      ...query,
      status: query.status as any,
    });
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const task = await taskService.getById(id);
    res.json(task);
  };

  update = async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const dto = updateTaskSchema.parse(req.body);
    const task = await taskService.update(id, dto as any);
    res.json(task);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    await taskService.delete(id);
    res.status(204).send();
  };
}

export const taskController = new TaskController();
