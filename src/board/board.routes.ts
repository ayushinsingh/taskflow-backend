import { Router } from "express";
import { BoardController } from "./board.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { boardParamsSchema, createBoardSchema } from "./dto/board.schema.ts";
import { ColumnController } from "./column/column.controller.ts";
import { TaskController } from "./task/task.controller.ts";
import { columnParamsSchema, createColumnSchema, reorderColumnSchema, updateColumnSchema } from "./column/dto/column.schema.ts";
import { createTaskSchema, reorderTasksSchema, taskParamsSchema, updateTaskSchema } from "./task/dto/task.schema.ts";
import { SubtaskController } from "./subtask/subtask.controller.ts";
import { createSubtaskSchema, subtaskParamsSchema } from "./subtask/dto/subtask.schema.ts";
import { requireWorkspaceAccess, requireSingleBoardAccess } from "../middleware/access.middleware.ts";

const router = Router();
const boardController = new BoardController();
const columnController = new ColumnController();
const taskController = new TaskController();
const subtaskController = new SubtaskController();

router.post("/", validate({ body: createBoardSchema }), requireWorkspaceAccess("workspace", "body", "workspaceId"), boardController.createBoard.bind(boardController));
router.get("/:id", validate({ params: boardParamsSchema }), requireWorkspaceAccess("board", "params", "id"), boardController.getBoard.bind(boardController));
router.delete("/:id", validate({ params: boardParamsSchema }), requireWorkspaceAccess("board", "params", "id"), boardController.deleteBoard.bind(boardController));

router.post("/columns", validate({ body: createColumnSchema }), requireWorkspaceAccess("board", "body", "boardId"), columnController.createColumn.bind(columnController));
router.delete("/columns/:id", validate({ params: columnParamsSchema }), requireWorkspaceAccess("column", "params", "id"), columnController.deleteColumn.bind(columnController));
router.patch("/columns/reorder", validate({ body: reorderColumnSchema }), requireSingleBoardAccess([{resource:"column", arrayKey: "columns", itemKey: "id"}]), columnController.reorderColumns.bind(columnController));
router.patch("/columns/", validate({ body: updateColumnSchema }), requireWorkspaceAccess("column", "body", "id"), columnController.updateColumn.bind(columnController));

router.post("/tasks", validate({ body: createTaskSchema }), requireWorkspaceAccess("column", "body", "columnId"), taskController.createTask.bind(taskController));
router.patch("/tasks/reorder", validate({ body: reorderTasksSchema }), requireSingleBoardAccess([{resource: "task", arrayKey: "tasks", itemKey: "id"}, {resource: "column", arrayKey: "tasks", itemKey: "columnId"}]), taskController.reorderTask.bind(taskController));
router.patch("/tasks/:id", validate({ params: taskParamsSchema, body: updateTaskSchema }), requireWorkspaceAccess("task", "params", "id"), taskController.updateTask.bind(taskController));
router.delete("/tasks/:id", validate({ params: taskParamsSchema }), requireWorkspaceAccess("task", "params", "id"), taskController.deleteTask.bind(taskController));

router.post("/subtasks", validate({ body: createSubtaskSchema }), requireWorkspaceAccess("task", "body", "taskId"), subtaskController.createSubtask.bind(subtaskController));
router.patch("/subtasks/:id/toggle", validate({ params: subtaskParamsSchema }), requireWorkspaceAccess("subtask", "params", "id"), subtaskController.toggleSubtask.bind(subtaskController));

export default router;