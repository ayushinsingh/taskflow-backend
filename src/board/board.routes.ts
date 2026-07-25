import Router from "express";
import { BoardController } from "./board.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { boardParamsSchema, createBoardSchema } from "./dto/board.schema.ts";
import { ColumnController } from "./column/column.controller.ts";
import { TaskController } from "./task/task.controller.ts";
import { columnParamsSchema, createColumnSchema, reorderColumnSchema, updateColumnSchema } from "./column/dto/column.schema.ts";
import { createTaskSchema, reorderTasksSchema, taskParamsSchema, updateTaskSchema } from "./task/dto/task.schema.ts";
import { SubtaskController } from "./subtask/subtask.controller.ts";
import { createSubtaskSchema, subtaskParamsSchema } from "./subtask/dto/subtask.schema.ts";

const router = Router();
const boardController = new BoardController();
const columnController = new ColumnController();
const taskController = new TaskController();
const subtaskController = new SubtaskController();

router.post("/", validate({ body: createBoardSchema }), boardController.createBoard.bind(boardController));
router.get("/:id", validate({ params: boardParamsSchema }), boardController.getBoard.bind(boardController));
router.delete("/:id", validate({ params: boardParamsSchema }), boardController.deleteBoard.bind(boardController));

router.post("/columns", validate({ body: createColumnSchema }), columnController.createColumn.bind(columnController));
router.delete("/columns/:id", validate({ params: columnParamsSchema }), columnController.deleteColumn.bind(columnController));
router.patch("/columns/reorder", validate({ body: reorderColumnSchema }), columnController.reorderColumns.bind(columnController));
router.patch("/columns/", validate({ body: updateColumnSchema }), columnController.updateColumn.bind(columnController));

router.post("/tasks", validate({ body: createTaskSchema }), taskController.createTask.bind(taskController));
router.patch("/tasks/reorder", validate({ body: reorderTasksSchema }), taskController.updateTask.bind(taskController));
router.patch("/tasks/:id", validate({ params: taskParamsSchema, body: updateTaskSchema }), taskController.updateTask.bind(taskController));
router.delete("/tasks/:id", validate({ params: taskParamsSchema }), taskController.deleteTask.bind(taskController));

router.post("/subtasks", validate({ body: createSubtaskSchema }), subtaskController.createSubtask.bind(subtaskController));
router.patch("/subtasks/:id/toggle", validate({ params: subtaskParamsSchema }), subtaskController.toggleSubtask.bind(subtaskController));

export default router;