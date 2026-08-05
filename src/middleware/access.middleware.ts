import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.ts";
import { ForbiddenError, NotFoundError } from "../errors/app-error.ts";

const workspaceIdResolvers = {
  workspace: (id: string) => prisma.workspace.findUnique({ where: { id }, select: { id: true } }).then(r => r?.id),
  board: (id: string) => prisma.board.findUnique({ where: { id }, select: { workspaceId: true } }).then(r => r?.workspaceId),
  column: (id: string) => prisma.column.findUnique({ where: { id }, select: { board: { select: { workspaceId: true } } } }).then(r => r?.board.workspaceId),
  task: (id: string) => prisma.task.findUnique({ where: { id }, select: { column: { select: { board: { select: { workspaceId: true } } } } } }).then(r => r?.column.board.workspaceId),
  subtask: (id: string) => prisma.subtask.findUnique({ where: { id }, select: { task: { select: { column: { select: { board: { select: { workspaceId: true } } } } } } } }).then(r => r?.task.column.board.workspaceId),
};

export const requireWorkspaceAccess =
  (resource: keyof typeof workspaceIdResolvers, idFrom: "body" | "params", idKey: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const workspaceId = await workspaceIdResolvers[resource](req[idFrom][idKey]);
      if (!workspaceId) throw new NotFoundError(`${resource} not found`);

      const member = await prisma.membership.findUnique({
        where: { userId_workspaceId: { userId: req.user.id, workspaceId } },
      });
      if (!member) throw new ForbiddenError();
      req.workspaceId = workspaceId;
      next();
    };

const boardResolvers = {
  column: (ids: string[]) => prisma.column.findMany({
    where: { id: { in: ids } },
    select: { board: { select: { id: true, workspaceId: true } } },
  }).then(rows => rows.map(r => r.board)),   // [{ id: boardId, workspaceId }]
  task: (ids: string[]) => prisma.task.findMany({
    where: { id: { in: ids } },
    select: { column: { select: { board: { select: { id: true, workspaceId: true } } } } },
  }).then(rows => rows.map(r => r.column.board)),
};

type Group = { resource: keyof typeof boardResolvers; arrayKey: string; itemKey: string };

export const requireSingleBoardAccess =
  (groups: Group[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const boards: { id: string; workspaceId: string }[] = [];

    for (const g of groups) {
      const ids = req.body[g.arrayKey].map((item: any) => item[g.itemKey]);
      const resolved = await boardResolvers[g.resource](ids);
      if (resolved.length !== new Set(ids).size) throw new NotFoundError("Some items not found");
      boards.push(...resolved);
    }

    const distinctBoards = new Set(boards.map(b => b.id));
    if (distinctBoards.size !== 1) throw new ForbiddenError("Reorder must be within one board");

    const workspaceId = boards[0]?.workspaceId;
    if (!workspaceId) throw new ForbiddenError();
    const member = await prisma.membership.findUnique({
      where: { userId_workspaceId: { userId: req.user.id, workspaceId } },
    });
    if (!member) throw new ForbiddenError();
    next();
  };

