import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.ts";
import { AppError } from "../errors/app-error.ts";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if(err instanceof AppError) {
    return res.status(err.statusCode).json({message: err.message});
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Resource already exists" });
    }
  }
  return res.status(500).json({ message: "Internal server error" });
}