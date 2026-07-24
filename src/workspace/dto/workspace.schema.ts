import {z} from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(20),
})

export interface CreateWorkspaceDto extends z.infer<typeof createWorkspaceSchema> {
  userId: string;
}

export interface GetWorkspacesDto {
  id: string;
}