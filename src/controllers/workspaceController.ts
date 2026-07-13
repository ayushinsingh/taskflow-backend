import type { Request, Response } from "express"
import prisma from "../config/db.ts";
export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        boards: {

        }
      }
    });
    return res.status(200).json({workspaces});
  } catch (error) {
    console.log("❌ Error fetching workspaces:", error);
  }
}