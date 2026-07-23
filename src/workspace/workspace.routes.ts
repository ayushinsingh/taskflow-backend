import { Router } from "express";
import { WorkspaceController } from "./workspace.controller.ts";

const router = Router();
const workspaceController = new WorkspaceController();
router.post("/", workspaceController.createWorkspace.bind(workspaceController));
router.get("/", workspaceController.getWorkspaces.bind(workspaceController));
router.post("/:workspaceId/invitations", workspaceController.createInvitation.bind(workspaceController));

export default router;