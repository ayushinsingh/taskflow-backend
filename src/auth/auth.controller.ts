import type { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";

export class AuthController {
  private authService = new AuthService();
  async signup(req: Request, res: Response) {
    const body = req.body;
    const result = await this.authService.signup(body);
    res.status(201).json(result);
  }
  async login(req: Request, res: Response) {
    const body = req.body;
    const result = await this.authService.login(body);
    res.status(200).json(result);
  }

}