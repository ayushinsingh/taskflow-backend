import { Router } from "express";
import { getBoardById } from "../controllers/boardController.ts";

const router = Router();

router.get("/:boardId", getBoardById);

export default router;