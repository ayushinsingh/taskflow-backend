import type { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";

function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
    path: "/"
  })
}

export class AuthController {
  private authService = new AuthService();
  async signup(req: Request, res: Response) {
    const body = req.body;
    const result = await this.authService.signup(body);
    setAuthCookie(res, result.accessToken);
    res.status(201).json({ user: result.user});
  }
  async login(req: Request, res: Response) {
    const body = req.body;
    const result = await this.authService.login(body);
    setAuthCookie(res, result.accessToken);
    res.status(200).json({ user: result.user});
  }

  async me(req: Request, res: Response) {
    const { id, name, email } = req.user;
    return res.status(200).json({ user: { id, name, email } });
  }

  async logout(_req:Request, res: Response) {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none": "lax",
      path: "/"
    });
    res.json({message: "Logged out"});
  }

}