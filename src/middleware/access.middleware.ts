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

      next();
    };

const batchResolver = {
  column: (ids: string[]) => prisma.column.findMany({
    where: {
      id: {
        in: ids
      }
    },
    select: {
      board: {
        select: {
          workspaceId: true
        }
      }
    }
  }).then(rows => rows.map(r => r.board.workspaceId)),
  task: (ids: string[]) => prisma.task.findMany({
    where: {
      id: {
        in: ids
      }
    },
    select: {
      column: {
        select: {
          board: {
            select: {
              workspaceId: true
            }
          }
        }
      }
    }
  }).then(rows => rows.map(r => r.column.board.workspaceId)),
};

export const requireWorkspaceAccessBatch =
  (resource: keyof typeof batchResolver, arrayKey: string, itemIdKey = "id") =>
    async (req: Request, res: Response, next: NextFunction) => {
      const ids: string[] = req.body[arrayKey].map((item: any) => item[itemIdKey]);
      const workspaceIds = await batchResolver[resource](ids);

      if (workspaceIds.length !== ids.length) throw new NotFoundError("Some items not found");
      const distinct = new Set(workspaceIds);
      const [workspaceId] = distinct;
      if (distinct.size !== 1 || !workspaceId) throw new ForbiddenError("Reorder must be within one workspace");
      
      const member = await prisma.membership.findUnique({
        where: {
          userId_workspaceId: { userId: req.user.id, workspaceId: workspaceId }
        }
      });
      if(!member) throw new ForbiddenError();

      next();
    };
