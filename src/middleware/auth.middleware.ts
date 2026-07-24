import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../auth/jwt.service.ts";
import prisma from "../config/db.ts";
import { UnauthorizedError } from "../errors/app-error.ts";

export async function  authMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtService = new JwtService();
  const authHeader = req.headers.authorization ?? "";
  const authArray = authHeader.split(' ');
  const token = authArray.length > 1 ? authArray[1]: authArray[0];
  if(!authHeader || !token) throw new UnauthorizedError();
  const decoded = jwtService.verifyAccessToken(token);
  const user = await prisma.user.findUnique({where: {
    id: decoded.userId
  }})
  if(!user) throw new UnauthorizedError("User not found") ;
  req.user = user;
  next();
  
}