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
}