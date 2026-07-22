import prisma from "../config/db.ts";
import type { CreateWorkspaceDto } from "./dto/createWorkspace.schema.ts";
import type { GetWorkspacesDto } from "./dto/getWorkspaces.schema.ts";

export class WorkspaceService {
  async createWorkspaces(createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = await prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        memberships: {
          create: {
            userId: createWorkspaceDto.userId,
            role: "OWNER"
          }
        }
      },
      include: {memberships: true}
    })
    return workspace;
  }
  async getWorkspaces(getWorkspaceDto: GetWorkspacesDto) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        memberships: {
          some: {userId: getWorkspaceDto.id}
        }
      },
      include: {
        boards: true
      }
    })
    return workspaces;
  }
}