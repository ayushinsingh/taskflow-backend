import z from "zod";

export const createSubtaskSchema = z.object({
  title: z.string().min(2).max(100),
  taskId: z.uuid()
});

export const subtaskParamsSchema = z.object({
  id: z.uuid()
})

export type CreateSubtaskDTO = z.infer<typeof createSubtaskSchema>;