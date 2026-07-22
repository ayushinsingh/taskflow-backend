import type { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service.ts";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();
  async createWorkspace(req: Request, res: Response) {
    const user = req.user;
    const {name} = req.body;
    if(!name) return res.status(400).json({message: "Body is not correct"});
    const workspace = await this.workspaceService.createWorkspaces({userId: user.id, name});
    res.status(201).json({workspace});
  }
  async getWorkspace(req: Request, res: Response) {
    const { id } = req.user;

    if(!id) return res.status(400).json({message: "id is required"})
    const workspaces = await this.workspaceService.getWorkspaces({id});
    res.status(200).json({workspaces});
  }
}