import { Router } from "express";
import { getBoardById } from "../controller/boardController.ts";

const router = Router();

router.get("/:boardId", getBoardById);

export default router;