import { Router } from "express";
import { getBoardById } from "../controllers/boardController.ts";
import { createTask, deleteTask, updateTask } from "../controllers/taskController.ts";

const router = Router();

router.get("/:boardId", getBoardById);
router.post("/tasks", createTask);
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

export default router;