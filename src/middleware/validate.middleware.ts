import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schemas: { body?: ZodType; params?: ZodType; query?: ZodType }) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body)   req.body   = schemas.body.parse(req.body);
    if (schemas.params) schemas.params.parse(req.params);
    next();
  };