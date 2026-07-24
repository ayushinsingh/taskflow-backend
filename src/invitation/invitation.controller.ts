import type { Request, Response } from "express";
import { InvitationService } from "./invitation.service.ts";
import { BadRequestError, NotFoundError } from "../errors/app-error.ts";

export class InvitationController {
  private invitationService = new InvitationService();
  async getInvitations(req: Request, res: Response) {
    const invitations = await this.invitationService.getInvitations({ email: req.user.email })
    return res.status(200).json({ invitations });
  }
  async acceptInvitation(req: Request, res: Response) {
    const id = req.params.id;
    const email = req.user.email;
    if (typeof id !== "string") throw new BadRequestError("Invalid invitation id");
    const invitation = await this.invitationService.getActionableInvitation({ id, email });
    await this.invitationService.acceptInvitation({ id, userId: req.user.id, workspaceId: invitation.workspaceId, role: invitation.role });
    res.status(200).json({ message: "Success" });
  }

  async declineInvitation(req: Request, res: Response) {
    const id = req.params.id;
    const email = req.user.email;
    if (typeof id !== "string") throw new BadRequestError("invalid invitation id");
    await this.invitationService.getActionableInvitation({ id, email });
    await this.invitationService.declineInvitation({ id });
    res.status(200).json({ message: "Success" });
  }

}