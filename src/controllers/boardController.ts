import type { Request, Response } from "express";
import prisma from "../config/db.ts";

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, workspaceId } = req.body;
    if (!title || !workspaceId) {
      res.status(400).json({ error: "Title is required to create a board" });
      return;
    }

    const newBoard = await prisma.board.create({
      data: {
        title,
        workspaceId
      }
    })

    res.status(201).json(newBoard);
  } catch (error) {
    console.error("❌ Error creating board:", error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    if (typeof boardId !== "string") {
      res.status(400).json({ error: "id is required to delete a board" });
      return;
    }

    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) return res.status(404).json({ error: "board is not in the system" });

    await prisma.board.delete({
      where: { id: boardId }
    });

    res.status(200).json({ message: "Board successfully deleted" });
  } catch (error) {
    console.error("❌ Error creating board:", error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    if (typeof boardId !== "string") {
      res.status(400).json({ error: "Board id parameter is required!" });
      return;
    }

    const boardData = await prisma.board.findUnique({
      where: { id: boardId },
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

    if (!boardData) return res.status(404).json({ error: "Board not found" });

    res.status(200).json(boardData);
  } catch (error) {
    console.log("❌ Error fetching board:", error);
    res.status(500).json({ error: "" });
  }
};
