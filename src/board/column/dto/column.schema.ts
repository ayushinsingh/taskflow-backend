import z from "zod";

export const createColumnSchema = z.object({
  title: z.string().min(2).max(10),
  boardId: z.uuid()
})
export type CreateColumnDTO = z.infer<typeof createColumnSchema>;

export const updateColumnSchema = z.object({
  title: z.string().min(2).max(10),
  id: z.uuid()
})
export type UpdateColumnDTO = z.infer<typeof updateColumnSchema>;


export const columnParamsSchema = z.object({
  id: z.uuid()
})

export const reorderColumnSchema = z.object({
  columns: z.array(z.object({
    id: z.uuid(),
    position: z.number()
  }))
})
export type ReorderColumnDTO = z.infer<typeof reorderColumnSchema>;

