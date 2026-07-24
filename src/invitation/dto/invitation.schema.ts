import z from "zod";
import type { Role } from "../../../generated/prisma/enums.ts";

export const invitationParamsSchema = z.object({
  id: z.uuid()
})

export interface GetInvitationsDto {
  email: string;
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