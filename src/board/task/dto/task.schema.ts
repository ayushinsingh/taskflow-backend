import z from "zod";

export const createTaskSchema = z.object({
  assignedToId: z.uuid().nullable().optional(),
  title: z.string().min(2).max(100),
  description: z.string().default(""),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "URGENT"]).default("MEDIUM"),
  columnId: z.uuid()
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema> & { createdById: string, workspaceId: string };

export const taskParamsSchema = z.object({
  id: z.uuid()
});

export const updateTaskSchema = z.object({
  assignedToId: z.uuid().nullable().optional(),
  title: z.string().min(2).max(100).optional(),
  description: z.string().default("").optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "URGENT"]).default("MEDIUM").optional(),
}).refine((data) => Object.values(data).some(val => val !== undefined), { message: "At least one field must be provided for update" });

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema> & z.infer<typeof taskParamsSchema> & { workspaceId: string };

export const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.uuid(),
    position: z.number(),
    columnId: z.uuid()
  }))
});

export type ReorderTasksDTO = z.infer<typeof reorderTasksSchema>;


