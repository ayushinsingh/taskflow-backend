import z from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(2).max(20),
  workspaceId: z.uuid()
})

export type CreateBoardDTO = z.infer<typeof createBoardSchema>;

export const boardParamsSchema = z.object({
  boardId: z.uuid()
})
