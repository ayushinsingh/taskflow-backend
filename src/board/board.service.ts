import prisma from "../config/db.ts";
import type { CreateBoardDTO } from "./dto/board.schema.ts";

export class BoardService {
  async createBoard(createBoardDto: CreateBoardDTO) {
    const board = await prisma.board.create({
      data: {
        title: createBoardDto.title,
        workspaceId: createBoardDto.workspaceId
      }
    })
    return board;
  }

  async getBoard(id: string) {
    const board = await prisma.board.findUnique({
      where: {
        id
      },
      include: {
        columns: {
         include: {
          tasks: {
            include: {
              subtasks: true
            }
          }
         }
        }
      }
    })
    return board;
  }

  async deleteBoard(id: string) {
    await prisma.board.delete({
      where: {
        id
      }
    })
  }
}