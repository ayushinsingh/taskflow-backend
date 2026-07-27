import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./auth/auth.routes.ts";
import workspaceRouter from "./workspace/workspace.routes.ts";
import inviationRouter from "./invitation/invitation.routes.ts";
import boardRouter from "./board/board.routes.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";
import { authMiddleware } from "./middleware/auth.middleware.ts";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(authMiddleware);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/boards", boardRouter);
app.use("/api/invitations", inviationRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`\n🪐 [SERVER RUNNING]: Open your postman and hit request to http://localhost:${PORT}`);
})