import prisma from "../../config/db.ts";
import type { Prisma } from "../../../generated/prisma/client.ts";
import type { CreateTaskDTO, ReorderTasksDTO, UpdateTaskDTO } from "./dto/task.schema.ts";

export class TaskService {
  async createTask(createTaskDto: CreateTaskDTO) {
    const count = await prisma.task.count({where: {columnId: createTaskDto.columnId}});
    const task = await prisma.task.create({
      data: {
        ...createTaskDto,
        position: count+1
      }
    })
    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDTO) {
    const { id, ...data } = updateTaskDto;
    const task = await prisma.task.update({
      where: {
        id
      },
      data: data as Prisma.TaskUpdateInput
    })
    return task;
  }

  async deleteTask(id: string) {
    await prisma.task.delete({
      where: {
        id
      }
    })
  }

  async reorderTasks(reorderTasksDto: ReorderTasksDTO) {
    await prisma.$transaction(reorderTasksDto.tasks.map((task: { id: string; position: number; columnId: string }) => (
      prisma.task.update({
        where: { id: task.id },
        data: {
          position: task.position,
          columnId: task.columnId
        }
      })
    )))
  }
}