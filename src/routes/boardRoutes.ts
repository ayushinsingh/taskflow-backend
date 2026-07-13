import { Router } from "express";
import { getBoardById } from "../controllers/boardController.ts";
import { createTask, deleteTask, updateTask } from "../controllers/taskController.ts";
import { createSubtask, toggleSubtask } from "../controllers/subtaskController.ts";

const router = Router();

router.get("/:boardId", getBoardById);

router.post("/tasks", createTask);
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

router.post("/subtasks", createSubtask);
router.patch("/subtasks/:subtaskId", toggleSubtask);

export default router;