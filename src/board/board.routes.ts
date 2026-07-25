import Router from "express";
import { BoardController } from "./board.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { boardParamsSchema, createBoardSchema } from "./dto/board.schema.ts";
import { ColumnController } from "./column/column.controller.ts";
import { columnParamsSchema, createColumnSchema, reorderColumnSchema, updateColumnSchema } from "./column/dto/column.schema.ts";

const router = Router();
const boardController = new BoardController();
const columnController = new ColumnController();
router.post("/", validate({ body: createBoardSchema }), boardController.createBoard.bind(boardController));
router.get("/:id", validate({params: boardParamsSchema}), boardController.getBoard.bind(boardController));
router.delete("/:id", validate({params: boardParamsSchema}), boardController.deleteBoard.bind(boardController));

router.post("/columns", validate({body: createColumnSchema}), columnController.createColumn.bind(columnController));
router.delete("/columns/:id", validate({params: columnParamsSchema}), columnController.deleteColumn.bind(columnController));
router.patch("/columns/reorder", validate({body: reorderColumnSchema}), columnController.reorderColumns.bind(columnController));
router.patch("/columns/", validate({body: updateColumnSchema}),  columnController.updateColumn.bind(columnController));

export default router;