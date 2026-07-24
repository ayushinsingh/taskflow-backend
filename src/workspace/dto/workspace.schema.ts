import {z} from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(20),
  userId: z.string()
})

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>

export const getWorkspacesSchema = z.object({
  id: z.string().min(1)
})

export interface GetWorkspacesDto {
  id: string;
}