import { Router } from "express";
import { InvitationController } from "./invitation.controller.ts";
const invitationController = new InvitationController();
const router = Router();
router.get("/", invitationController.getInvitations.bind(invitationController));
export default router;