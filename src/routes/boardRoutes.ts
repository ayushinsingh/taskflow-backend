import { Router } from "express";
import { createBoard, deleteBoard, getBoardById } from "../controllers/boardController.ts";
import { createTask, deleteTask, reorderTasks, updateTask } from "../controllers/taskController.ts";
import { createSubtask, toggleSubtask } from "../controllers/subtaskController.ts";
import { createColumn, deleteColumn, reorderColumns, updateColumn } from "../controllers/columnController.ts";

const router = Router();

router.get("/:boardId", getBoardById);
router.post("/", createBoard);
router.delete("/:boardId", deleteBoard);

router.post("/columns", createColumn);
router.delete("/columns/:columnId", deleteColumn);
router.patch("/columns/reorder", reorderColumns);
router.patch("/columns/", updateColumn);

router.post("/tasks", createTask);
router.patch("/tasks/reorder", reorderTasks);
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

router.post("/subtasks", createSubtask);
router.patch("/subtasks/:subtaskId/toggle", toggleSubtask);

export default router;