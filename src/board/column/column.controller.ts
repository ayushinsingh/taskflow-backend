import type { Request, Response } from "express";
import { ColumnService } from "./column.service.ts";

export class ColumnController {
  private columnService = new ColumnService();

  async createColumn(req: Request, res: Response) {
    const column = await this.columnService.createColumn(req.body);
    return res.status(201).json(column);
  }

  async deleteColumn(req: Request, res: Response) {
    await this.columnService.deleteColumn(req.params.id as string);
    res.status(200).json({message: "success"});
  }

  async updateColumn(req: Request, res: Response) {
    const column = await this.columnService.updateColumn(req.body);
    return res.status(200).json(column);
  }

  async reorderColumns(req: Request, res: Response) {
    await this.columnService.reorderColumns(req.body);
    return res.status(200).json({message: "Columns reodered successfully"})
  }
}