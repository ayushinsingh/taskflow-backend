import type { Request, Response } from "express";
import prisma from "../config/db.ts";

export const createColumn = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(404).json({ error: "Title and columnId are required." });
    }

    const columnCount = await prisma.column.count({
      where: { boardId },
    });

    const newColumn = await prisma.column.create({
      data: {
        title,
        position: columnCount,
        boardId,
      },
    });

    res.status(201).json(newColumn);
  } catch (error) {
    console.error("❌ Error creating column:", error);
    res.status(500).json({ error: "Internal server error occurred while creating column." });
  }
}

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { title, columnId } = req.body;

    if (!title || !columnId) {
      return res.send(400).json({ error: "title and columnId is required to update the column" });
    }

    const existingColumn = await prisma.column.findUnique({
      where: {
        id: columnId
      }
    })

    if (!existingColumn) {
      return res.send(404).json({ error: "Column not found" })
    }

    const updatedColumn = await prisma.column.update({
      where: {
        id: columnId
      },
      data: {
        title: title !== undefined ? title : existingColumn.title,
      }
    });

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;
    if (typeof columnId !== "string") {
      return res.status(401).json({ error: "Column id is required!" });
    }
    await prisma.column.delete({
      where: {
        id: columnId
      }
    })
    res.status(200).json({ message: "Column successfully deleted from the board." });
  } catch (error) {
    console.error("❌ Error deleting Column:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const reorderColumns = async (req: Request, res: Response) => {
  try {
    const { columns } = req.body;
    if (!columns || !Array.isArray(columns)) {
      return res.status(400).json({ error: "An array of tasks is required." });
    }

    await prisma.$transaction(columns.map((task: { id: string; position: number }) => (
      prisma.task.update({
        where: { id: task.id },
        data: {
          position: task.position,
        }
      })
    )))
    res.status(200).json({ message: "Columns reodered successfully" });
  } catch (error) {
    console.log("❌ Error reordering Columns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
