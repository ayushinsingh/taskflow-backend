import prisma from "../../config/db.ts";
import type { CreateColumnDTO, ReorderColumnDTO, UpdateColumnDTO } from "./dto/column.schema.ts";

export class ColumnService {
  async createColumn(createColumnDto: CreateColumnDTO) {
    const count = await prisma.column.count({
      where: {
        boardId: createColumnDto.boardId
      }
    });

    const column = await prisma.column.create({
      data: {
        ...createColumnDto,
        position: count+1
      }
    })
    return column;
  }
  async updateColumn(updateColumnDto: UpdateColumnDTO) {
    const column = await prisma.column.update({
      where: {
        id: updateColumnDto.id
      },
      data: {
        title: updateColumnDto.title
      }
    })
    return column;
  }
  async deleteColumn(id: string) {
    await prisma.column.delete({
      where: {
        id
      }
    })
  }
  async reorderColumns(reorderDTO: ReorderColumnDTO) {
    await prisma.$transaction(reorderDTO.columns.map((column) => (
      prisma.column.update({
        where: { id: column.id },
        data: {
          position: column.position,
        }
      })
    )))
  }
}