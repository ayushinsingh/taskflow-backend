import type { Role } from "../../generated/prisma/enums.ts";
import prisma from "../config/db.ts";

export class InvitationService {
  async getInvitations(email: string) {
    const invitations = await prisma.invitation.findMany({
      where: {
        email,
        status: "PENDING"
      },
      include: {
        invitedBy: {
          select: {
            name: true
          }
        },
        workspace: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })
    return invitations;
  }

  async getInvitation(id: string) {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id
      }
    });
    return invitation;
  }

  async acceptInvitation(id: string, userId: string, workspaceId: string, role: Role) {
    await prisma.$transaction([
      prisma.invitation.update({
        where: {
          id
        },
        data: {
          status: "ACCEPTED"
        }
      }),
      prisma.membership.create({
        data: {
          userId,
          workspaceId,
          role
        }
      })
    ])
  }
  async declineInvitation(id: string, userId: string, workspaceId: string, role: Role) {
    await prisma.invitation.update({
      where: {
        id
      },
      data: {
        status: "DECLINED"
      }
    })
  }
}