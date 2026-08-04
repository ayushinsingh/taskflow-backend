import { z} from "zod";

export const createInvitationBodySchema = z.object({
  email: z.email(),
  role: z.enum(["OWNER","ADMIN", "MEMBER"]).default("MEMBER")
});


export const workspaceParamsSchema = z.object({
  workspaceId: z.uuid()
})

export const workspaceInvitationSchema = z.object({
  workspaceId: z.uuid(),
  id: z.uuid()
});

export type WorkspaceInvitationType = z.infer<typeof workspaceInvitationSchema>;

type combinedInvitationType  = z.infer<typeof createInvitationBodySchema> & z.infer<typeof workspaceParamsSchema>
export interface CreateInvitationDto extends combinedInvitationType   {
  userId: string
}

export interface CheckPermissionForCreatingInvitation {
  workspaceId: string;
  invitedById: string
}

