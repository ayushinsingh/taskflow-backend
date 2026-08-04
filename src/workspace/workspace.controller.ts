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
    const isAdmin = await this.workspaceService.checkPermissionForMembershipOperations({ invitedById: id, workspaceId });
    if (!isAdmin) throw new ForbiddenError();
    const existing = await this.workspaceService.getMembershipByEmailAndWorkspaceId(email, workspaceId);
    if (existing) throw new ConflictError("User is already member");
    const invitation = await this.workspaceService.createInvitation({ email, workspaceId, role, userId: id });
    res.status(201).json({ invitation });
  }

  async getMembersByWorkspaceId(req: Request, res: Response) {
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId as string;
    const isAdmin = await this.workspaceService.checkPermissionForMembershipOperations({ invitedById: userId, workspaceId });
    if (!isAdmin) throw new ForbiddenError();
    const memberships = await this.workspaceService.getMembersByWorkspaceId(workspaceId);
    res.status(200).json({ memberships });
  }
  async getPendingInvitation(req: Request, res: Response) {
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId as string;
    const isAdmin = await this.workspaceService.checkPermissionForMembershipOperations({ invitedById: userId, workspaceId });
    if (!isAdmin) throw new ForbiddenError();
    const invites = await this.workspaceService.getPendingInvitesForWorkspace(workspaceId);
    res.status(200).json({ invites });
  }

  async revokeWorkspaceInvite(req: Request, res: Response) {
    const userId = req.user.id;
    const { workspaceId, id } = req.params;
    const isAdmin = await this.workspaceService.checkPermissionForMembershipOperations({ invitedById: userId, workspaceId: workspaceId as string });
    if (!isAdmin) throw new ForbiddenError();
    await this.workspaceService.revokeInviteForWorkspace(workspaceId as string, id as string);
    res.status(200).json({ message: "Success" });
  }
}