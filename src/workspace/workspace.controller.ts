import type { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service.ts";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();
  async createWorkspace(req: Request, res: Response) {
    const user = req.user;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Body is not correct" });
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
    if (typeof workspaceId !== "string") return res.status(400).json({ message: "Invalid workspaceId" });
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ message: "Invalid request body" });
    const isAdmin = await this.workspaceService.checkPermissionForCreatingInvitation({ invitedById: id, workspaceId });
    if (!isAdmin) return res.status(403).json({ message: "You are not allowed to invite anyone" });
    const invitation = await this.workspaceService.createInvitation({ email, workspaceId, role: role || "MEMBER", invitedById: id });
    return res.status(201).json({ invitation });
  }
}