import type { Role } from "../../generated/prisma/enums.ts";
import prisma from "../config/db.ts";
import { ConflictError, ForbiddenError, NotFoundError } from "../errors/app-error.ts";
import type { AcceptInvitationDto, DeclineInvitationDto, GetActionableInvitationDto, GetInvitationsDto } from "./dto/invitation.schema.ts";

export class InvitationService {
  async getInvitations(getInvitationsDto: GetInvitationsDto) {
    const invitations = await prisma.invitation.findMany({
      where: {
        email: getInvitationsDto.email,
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

  async getActionableInvitation(getActionableInvitation: GetActionableInvitationDto) {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: getActionableInvitation.id
      }
    });
    if(!invitation) throw new NotFoundError("Invitation not found");
    if (invitation.email !== getActionableInvitation.email) throw new ForbiddenError();
    if (invitation.status !== "PENDING") throw new ConflictError("already accepted/declined");

    return invitation;
  }

  async acceptInvitation(accceptInvitationDto: AcceptInvitationDto) {
    await prisma.$transaction([
      prisma.invitation.update({
        where: {
          id: accceptInvitationDto.id
        },
        data: {
          status: "ACCEPTED"
        }
      }),
      prisma.membership.create({
        data: {
          userId: accceptInvitationDto.userId,
          workspaceId: accceptInvitationDto.userId,
          role: accceptInvitationDto.role
        }
      })
    ])
  }
  async declineInvitation(declineInvitationDto: DeclineInvitationDto) {
    await prisma.invitation.update({
      where: {
        id: declineInvitationDto.id
      },
      data: {
        status: "DECLINED"
      }
    })
  }
}