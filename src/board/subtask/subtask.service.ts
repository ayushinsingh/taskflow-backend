import prisma from "../../config/db.ts";
import type { CreateSubtaskDTO } from "./dto/subtask.schema.ts";

export class SubtaskService {
  async createSubtask(createSubtaskDto: CreateSubtaskDTO) {
    const count = await prisma.subtask.count({
      where: {
        taskId: createSubtaskDto.taskId
      }
    });

    const subtask = await prisma.subtask.create({
      data: {
        title: createSubtaskDto.title,
        taskId: createSubtaskDto.taskId,
        isCompleted: false,
        position: count + 1
      }
    })
    return subtask;
  }

  async toggleSubtask(id: string) {
    const subtask = await prisma.subtask.findUnique({
      where: {
        id
      }
    });
    if(!subtask) return undefined;

    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        isCompleted: !subtask.isCompleted
      }
    })
    return updatedSubtask;
  }
}