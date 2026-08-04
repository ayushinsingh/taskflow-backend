import prisma from "../config/db.ts";
import type { CheckPermissionForCreatingInvitation, CreateInvitationDto } from "./dto/invitation.schema.ts";
import type { CreateWorkspaceDto } from "./dto/workspace.schema.ts";
import type { GetWorkspacesDto } from "./dto/workspace.schema.ts";

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
      include: { memberships: true }
    })
    return workspace;
  }
  async getWorkspaces(getWorkspaceDto: GetWorkspacesDto) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        memberships: {
          some: { userId: getWorkspaceDto.id }
        }
      },
      include: {
        boards: true,
        memberships: {
          where: {
            userId: getWorkspaceDto.id
          },
          select: {
            role: true
          }
        }
      }
    })
    return workspaces;
  }
  async checkPermissionForMembershipOperations(checkPermissionForCreatingInvitation: CheckPermissionForCreatingInvitation) {
    const membership = await prisma.membership.findFirst({
      where: {
        userId: checkPermissionForCreatingInvitation.invitedById,
        workspaceId: checkPermissionForCreatingInvitation.workspaceId,
        role: {
          in: ["OWNER", "ADMIN"]
        }
      }
    })
    if (membership) return true;
    return false;
  }

  async getMembershipByEmailAndWorkspaceId(email: string, workspaceId: string) {
    const existing = await prisma.membership.findFirst({
      where: {
        workspaceId,
        user: {
          email
        }
      }
    })
    return existing;
  }

  async createInvitation(createInvitationDto: CreateInvitationDto) {
    const invitation = await prisma.invitation.create({
      data: {
        role: createInvitationDto.role,
        invitedById: createInvitationDto.userId,
        email: createInvitationDto.email,
        workspaceId: createInvitationDto.workspaceId
      }
    })
    return invitation;
  }

  async getMembersByWorkspaceId(workspaceId: string) {
    const membership = await prisma.membership.findMany({
      where: {
        workspaceId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return membership;
  }

  async getPendingInvitesForWorkspace(workspaceId: string) {
    const invites = await prisma.invitation.findMany({
      where: {
        workspaceId,
        status: "PENDING"
      },
      include: {
        invitedBy: {
          select:{
            name:true,
            email: true
          }
        }
      }
    })
    return invites;
  }

  async revokeInviteForWorkspace(workspaceId: string, invitationId: string) {
    await prisma.invitation.delete({
      where: {
        workspaceId,
        id: invitationId,
        status: "PENDING"
      }
    })
  }
}