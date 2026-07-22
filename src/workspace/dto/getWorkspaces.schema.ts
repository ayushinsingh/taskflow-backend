import {z} from "zod";

export const getWorkspacesSchema = z.object({
  id: z.string().min(1)
})

export interface GetWorkspacesDto {
  id: string;
}