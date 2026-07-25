import type { Request, Response } from "express";
import { BoardService } from "./board.service.ts";

export class BoardController {
  private boardService = new BoardService();

  async createBoard(req:Request, res: Response) {
    const board = await this.boardService.createBoard(req.body);
    res.status(201).json(board);
  }
  async deleteBoard(req: Request, res: Response) {
    await this.boardService.deleteBoard(req.params.id as string);
    res.status(200).json({message: "success"});
  }
  async getBoard(req: Request, res: Response) {
    const board = await this.boardService.getBoard(req.params.id as string);
    res.status(200).json(board);
  }
}