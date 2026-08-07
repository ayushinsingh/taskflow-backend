import prisma from "../../config/db.ts";
import type { Prisma } from "../../../generated/prisma/client.ts";
import type { CreateTaskDTO, ReorderTasksDTO, UpdateTaskDTO } from "./dto/task.schema.ts";
import { BadRequestError, NotFoundError } from "../../errors/app-error.ts";

export class TaskService {
  async isMember(userId: string, workspaceId: string) {
    return prisma.membership.findUnique({ where: { userId_workspaceId: { userId, workspaceId } } }).then(Boolean);
  }
  async createTask(createTaskDto: CreateTaskDTO) {
    const {workspaceId, ...rest} = createTaskDto;

    if (createTaskDto.assignedToId && !(await this.isMember(createTaskDto.assignedToId, createTaskDto.workspaceId)))
      throw new BadRequestError("Assignee is not a member of this workspace");

    const count = await prisma.task.count({ where: { columnId: createTaskDto.columnId } });
    const task = await prisma.task.create({
      data: {
        ...rest,
        assignedToId: rest.assignedToId ?? null,
        position: count + 1
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDTO) {
    const { id, workspaceId, ...data } = updateTaskDto;

    if (updateTaskDto.assignedToId && !(await this.isMember(updateTaskDto.assignedToId, workspaceId)))
      throw new BadRequestError("Assignee is not a member of this workspace");

    const updatedtask = await prisma.task.update({
      where: {
        id
      },
      data: data as Prisma.TaskUpdateInput,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    return updatedtask;
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