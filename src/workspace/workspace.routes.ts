import { Router } from "express";
import { WorkspaceController } from "./workspace.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { createWorkspaceSchema } from "./dto/workspace.schema.ts";
import { createInvitationBodySchema, workspaceInvitationSchema, workspaceParamsSchema } from "./dto/invitation.schema.ts";

const router = Router();
const workspaceController = new WorkspaceController();
router.post("/", validate({body: createWorkspaceSchema}), workspaceController.createWorkspace.bind(workspaceController));
router.get("/", workspaceController.getWorkspaces.bind(workspaceController));
router.post("/:workspaceId/invitations", validate({body: createInvitationBodySchema, params: workspaceParamsSchema}), workspaceController.createInvitation.bind(workspaceController));
router.get("/:workspaceId/members", validate({params: workspaceParamsSchema}), workspaceController.getMembersByWorkspaceId.bind(workspaceController));
router.get("/:workspaceId/invitations", validate({params: workspaceParamsSchema}), workspaceController.getPendingInvitation.bind(workspaceController));
router.delete("/:workspaceId/invitations/:id", validate({params: workspaceInvitationSchema}), workspaceController.revokeWorkspaceInvite.bind(workspaceController));

export default router;