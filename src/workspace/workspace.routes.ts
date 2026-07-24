import { Router } from "express";
import { WorkspaceController } from "./workspace.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { createWorkspaceSchema } from "./dto/workspace.schema.ts";
import { createInvitationBodySchema, createInvitationParamsSchema } from "./dto/invitation.schema.ts";

const router = Router();
const workspaceController = new WorkspaceController();
router.post("/", validate({body: createWorkspaceSchema}), workspaceController.createWorkspace.bind(workspaceController));
router.get("/", workspaceController.getWorkspaces.bind(workspaceController));
router.post("/:workspaceId/invitations", validate({body: createInvitationBodySchema, params: createInvitationParamsSchema}), workspaceController.createInvitation.bind(workspaceController));

export default router;