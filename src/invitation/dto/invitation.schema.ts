import z from "zod";
import type { InvitationStatus, Role } from "../../../generated/prisma/enums.ts";

export const invitationParamsSchema = z.object({
  id: z.uuid()
})

export const invitationQuerySchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional()
})

export interface GetInvitationsDto {
  email: string;
  status?: InvitationStatus;
}

export interface GetActionableInvitationDto extends z.infer<typeof invitationParamsSchema> {
  email: string;
}

export interface AcceptInvitationDto extends z.infer<typeof invitationParamsSchema> {
  userId: string;
  role: Role;
  workspaceId: string;
}

export interface DeclineInvitationDto extends z.infer<typeof invitationParamsSchema> {
}