import { Router } from "express";
import { InvitationController } from "./invitation.controller.ts";
const invitationController = new InvitationController();
const router = Router();
router.get("/", invitationController.getInvitations.bind(invitationController));
router.post("/:id/accept", invitationController.acceptInvitation.bind(invitationController));
router.post("/:id/decline", invitationController.declineInvitation.bind(invitationController));
export default router;