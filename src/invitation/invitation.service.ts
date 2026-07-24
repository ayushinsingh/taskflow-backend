import type { Role } from "../../generated/prisma/enums.ts";
import prisma from "../config/db.ts";
import { ConflictError, ForbiddenError, NotFoundError } from "../errors/app-error.ts";

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

  async getActionableInvitation(id: string, email: string) {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id
      }
    });
    if(!invitation) throw new NotFoundError("Invitation not found");
    if (invitation.email !== email) throw new ForbiddenError();
    if (invitation.status !== "PENDING") throw new ConflictError("already accepted/declined");

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
  async declineInvitation(id: string) {
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