import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../auth/jwt.service.ts";
import prisma from "../config/db.ts";

export async function  authMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtService = new JwtService();
  const authHeader = req.headers.authorization ?? "";
  const authArray = authHeader.split(' ');
  const token = authArray.length > 1 ? authArray[1]: authArray[0];
  if(!authHeader || !token) return res.status(401).json({message: "Authorization is required"});
  try {
    const decoded = jwtService.verifyAccessToken(token);
    const user = await prisma.user.findUnique({where: {
      id: decoded.userId
    }})
    if(!user) return res.status(401).json({message: "User not found"});
    req.user = user;
    next();
  } catch(error: any) {
    const message = error instanceof Error ? error.message : "INVALID_TOKEN";
    if(message === "TOKEN_EXPIRED") {
      return res.status(401).json({message: "Token expired relogin again"});
    }
    return res.status(401).json({message: "Token is invalid"})
  }
}