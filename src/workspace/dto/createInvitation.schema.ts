import { z} from "zod";
import type { Role } from "../../../generated/prisma/enums.ts";

export const createInvitationSchema = z.object({
  email: z.email(),
  workspaceId: z.string(),
  role: z.string(),
  invitedById: z.string()
})

export interface CreateInvitationDto {
  email: string;
  workspaceId: string;
  role: Role,
  invitedById: string
}
export interface CheckPermissionForCreatingInvitation {
  workspaceId: string;
  invitedById: string
}

