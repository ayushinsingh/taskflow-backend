import type { Request, Response } from "express";
import { InvitationService } from "./invitation.service.ts";

export class InvitationController {
  private invitationService = new InvitationService();
  async getInvitations(req: Request, res: Response) {
    const invitations = await this.invitationService.getInvitations(req.user.email)
    return res.status(200).json({ invitations });
  }
}