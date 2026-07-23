import type { Request, Response } from "express";
import { InvitationService } from "./invitation.service.ts";

export class InvitationController {
  private invitationService = new InvitationService();
  async getInvitations(req: Request, res: Response) {
    const invitations = await this.invitationService.getInvitations(req.user.email)
    return res.status(200).json({ invitations });
  }
  async acceptInvitation(req: Request, res: Response) {
    const id = req.params.id;
    const email = req.user.email;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid Request" });
    const invitation = await this.invitationService.getInvitation(id);
    if (!invitation) return res.status(404).json({message: "Invitation not found"});
    if (invitation?.email !== email) return res.status(403).json({message: "Forbidden"});
    if (invitation.status !== "PENDING") return res.status(409).json({ message: "already accepted/declined" });

    await this.invitationService.acceptInvitation(id, req.user.id, invitation.workspaceId, invitation.role);
    res.status(200).json({message: "Success"});

  }

  async declineInvitation(req: Request, res: Response) {
    const id = req.params.id;
    const email = req.user.email;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid Request" });
    const invitation = await this.invitationService.getInvitation(id);
    if (!invitation) return res.status(404).json({message: "Invitation not found"});
    if (invitation?.email !== email) return res.status(403).json({message: "Forbidden"});
    if (invitation.status !== "PENDING") return res.status(409).json({ message: "already accepted/declined" });

    await this.invitationService.declineInvitation(id, req.user.id, invitation.workspaceId, invitation.role);
    res.status(200).json({message: "Success"});
  }
  
}