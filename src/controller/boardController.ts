import type { Request, Response } from "express";
import prisma from "../config/db.ts";

export const getBoardById = async (req: Request, resp: Response) => {
  try {
    const { boardId } = req.params;
    if(typeof boardId !== "string") {
      resp.status(400).json({ error: "Board id parameter is required!" });
      return;
    }

    const boardData = await prisma.board.findUnique({
      where: {id: boardId},
      include: {
        columns: {
          orderBy: {
            position: "asc"
          },
          include: {
            tasks: {
              orderBy: {
                position: "asc"
              },
              include: {
                subtasks: {
                  orderBy: {
                    position: "asc"
                  }
                }
              }
            }
          }
        }
      }
    });

    if(!boardData) return resp.status(404).json({ error: "Board not found" });

    resp.json(boardData);
  } catch (err) {
    resp.status(500).json({ error: "Something went wrong!" });
  }
};
