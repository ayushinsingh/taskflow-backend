import type { Request, Response } from "express";
import prisma from "../config/db.ts";

export const createSubtask = async (req: Request, res: Response) => {
  try {
    const { title, taskId } = req.body;
    if(!title || !taskId) return res.status(400).json({error: "Title and taskId are required!"});

    const subtaskCount = await prisma.subtask.count({where: {
      taskId
    }})

    const newSubtask = await prisma.subtask.create({
      data: {
        title,
        taskId,
        isCompleted: false,
        position: subtaskCount
      }
    })

    res.status(201).json(newSubtask);

  } catch (error) {
    console.error("❌ Error creating subtask:", error);
    res.status(500).json({ error: "Internal server error occurred while creating subtask." });
  }
}

export const toggleSubtask = async (req: Request, res: Response) => {
  try {
    const { subtaskId } = req.params;
    if(typeof subtaskId != "string") return res.status(400).json({error: "subtaskId is required!"});

    const subtask = await prisma.subtask.findUnique({where: {
      id: subtaskId
    }})

    if(!subtask) res.status(404).json({error: "subtask not found"});

    const updatedSubtask = await prisma.subtask.update({
      where: {id: subtaskId},
      data: {
        isCompleted: !subtask?.isCompleted
      }
    })

    res.status(200).json(updatedSubtask);

  } catch (error) {
    console.error("❌ Error toggling subtask:", error);
    res.status(500).json({ error: "Internal server error occurred while creating subtask." });
  }
}

// curl -X POST http://localhost:5000/api/boards/subtasks \
//   -H "Content-Type: application/json" \
//   -d '{
//   "title": "New Subtask",
//   "taskId": "e66b0938-0d98-4d7c-96e5-399d682f6cce"
// }'
// curl -X PATCH http://localhost:5000/api/boards/subtasks/00e793ba-ab04-4318-be47-787256a9bfac \
//   -H "Content-Type: application/json" 