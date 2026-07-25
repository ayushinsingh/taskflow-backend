import type { Request, Response } from "express";
import { TaskService } from "./task.service.ts";

export class TaskController {
  private taskService = new TaskService();

  async createTask(req: Request, res: Response) {
    const task = await this.taskService.createTask(req.body);
    return res.status(201).json(task);
  }

  async updateTask(req:Request, res: Response) {
    const task = await this.taskService.updateTask({...req.body, ...req.params});
    return res.status(200).json(task);
  }

  async deleteTask(req:Request, res: Response) {
    await this.taskService.deleteTask(req.params.id as string);
    res.status(200).json({message: "success"});
  }

  async reorderTask(req:Request, res: Response) {
    await this.taskService.reorderTasks(req.body);
    res.status(200).json({message: "Tasks reordered successfully"});
  }
}