import type { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service.ts";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../errors/app-error.ts";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();
  async createWorkspace(req: Request, res: Response) {
    const user = req.user;
    const { name } = req.body;
    if (!name) throw new BadRequestError("Name is required to create workspace");
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
    const workspaceId = req.params.workspaceId;
    if (typeof workspaceId !== "string") throw new BadRequestError("Invalid workspace");
    const { email, role } = req.body;
    if (!email) throw new BadRequestError("Email is required");
    const isAdmin = await this.workspaceService.checkPermissionForCreatingInvitation({ invitedById: id, workspaceId });
    if (!isAdmin) throw new ForbiddenError();
    const existing = await this.workspaceService.getMembershipByEmailAndWorkspaceId(email, workspaceId);
    if (existing) throw new ConflictError("User is already member");
    const invitation = await this.workspaceService.createInvitation({ email, workspaceId, role: role || "MEMBER", invitedById: id });
    return res.status(201).json({ invitation });
  }
}