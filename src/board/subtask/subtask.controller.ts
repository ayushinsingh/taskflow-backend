import type { Request, Response } from "express";
import { SubtaskService } from "./subtask.service.ts";

export class SubtaskController {
  private subtaskService = new SubtaskService();
  async createSubtask(req: Request, res: Response) {
    const subtask = await this.subtaskService.createSubtask(req.body);
    res.status(201).json(subtask);
  }
  async toggleSubtask(req: Request, res: Response) {
    const subtask = await this.subtaskService.toggleSubtask(req.params.id as string);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });
    res.status(200).json(subtask);
  }
}