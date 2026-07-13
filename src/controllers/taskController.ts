import type { Request, Response } from "express";
import prisma from "../config/db.ts";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, columnId } = req.body;

    if (!title || !columnId) {
      return res.status(404).json({ error: "Title and columnId are required." });
    }

    const taskCount = await prisma.task.count({
      where: { columnId },
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || "",
        priority: priority || "medium",
        position: taskCount,
        columnId,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ error: "Internal server error occurred while creating task." });
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, columnId, position } = req.body;

    if (typeof taskId !== "string") {
      return res.send(400).json({ error: "id is required to update the task" });
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId
      }
    })

    if (!existingTask) {
      return res.send(404).json({ error: "Task not found" })
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        title: title !== undefined ? title : existingTask.title,
        priority: priority !== undefined ? priority : existingTask.priority,
        description: description !== undefined ? description : existingTask.description,
        columnId: columnId !== undefined ? columnId : existingTask.columnId,
        position: position !== undefined ? position : existingTask.position
      }
    })
    res.status(200).json(updateTask);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (typeof taskId !== "string") {
      return res.status(401).json({ error: "Task id is required!" });
    }
    await prisma.task.delete({
      where: {
        id: taskId
      }
    })
    res.status(200).json({ message: "Task successfully deleted from the board." });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// curl -X POST http://localhost:5000/api/boards/tasks \
//   -H "Content-Type: application/json" \
//   -d '{
//   "title": "Build Frontend UI Components",
//   "description": "Create the drag-and-drop board layouts using React.",
//   "priority": "high",
//   "columnId": "0ce46e32-217b-4712-84ac-4203f5d2982f"
// }'

// curl -X PATCH http://localhost:5000/api/boards/tasks/d6f942dc-6f49-4f21-a142-3b624b3e14aa \
//   -H "Content-Type: application/json" \
//   -d '{
//   "description": "Create the drag-and-drop board layouts using React and TailwindCSS.",
//   "priority": "medium"
// }'
// curl -X DELETE http://localhost:5000/api/boards/tasks/d6f942dc-6f49-4f21-a142-3b624b3e14aa

