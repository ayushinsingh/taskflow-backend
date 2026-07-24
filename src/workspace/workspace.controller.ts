import type { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service.ts";
import { ConflictError, ForbiddenError } from "../errors/app-error.ts";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();
  async createWorkspace(req: Request, res: Response) {
    const user = req.user;
    const { name } = req.body;
    const workspace = await this.workspaceService.createWorkspaces({ userId: user.id, name });
    res.status(201).json({ workspace });
  }

  async getWorkspaces(req: Request, res: Response) {
    const { id } = req.user;
    const workspaces = await this.workspaceService.getWorkspaces({ id });
    res.status(200).json({ workspaces });
  }

  async createInvitation(req: Request, res: Response) {
    const id = req.user.id;
    const workspaceId = req.params.workspaceId as string;
    const { email, role } = req.body;
    const isAdmin = await this.workspaceService.checkPermissionForCreatingInvitation({ invitedById: id, workspaceId });
    if (!isAdmin) throw new ForbiddenError();
    const existing = await this.workspaceService.getMembershipByEmailAndWorkspaceId(email, workspaceId);
    if (existing) throw new ConflictError("User is already member");
    const invitation = await this.workspaceService.createInvitation({ email, workspaceId,role, userId: id });
    return res.status(201).json({ invitation });
  }
}