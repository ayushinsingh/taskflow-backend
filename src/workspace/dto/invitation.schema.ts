import { z} from "zod";

export const createInvitationBodySchema = z.object({
  email: z.email(),
  role: z.enum(["OWNER","ADMIN", "MEMBER"]).default("MEMBER")
});


export const createInvitationParamsSchema = z.object({
  workspaceId: z.uuid()
})

type combinedInvitationType  = z.infer<typeof createInvitationBodySchema> & z.infer<typeof createInvitationParamsSchema>
export interface CreateInvitationDto extends combinedInvitationType   {
  userId: string
}

export interface CheckPermissionForCreatingInvitation {
  workspaceId: string;
  invitedById: string
}

