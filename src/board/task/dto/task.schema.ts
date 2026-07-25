import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().default(""),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "URGENT"]).default("MEDIUM"),
  columnId: z.uuid()
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;

export const taskParamsSchema = z.object({
  id: z.uuid()
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().default("").optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "URGENT"]).default("MEDIUM").optional(),
}).refine((data) => Object.values(data).some(val => val !== undefined), { message: "At least one field must be provided for update" });

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema> & z.infer<typeof taskParamsSchema>;

export const reorderTasksSchema = z.object({
  tasks:z.array(z.object({
    id: z.uuid(),
    position: z.number(),
    columnId: z.uuid()
  }))
});

export type ReorderTasksDTO = z.infer<typeof reorderTasksSchema>;


