import express from "express";
import cors from "cors";
import boardRouter from "./routes/boardRoutes.ts";
import authRouter from "./auth/auth.routes.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";
import workspaceRouter from "./workspace/workspace.routes.ts";
import { authMiddleware } from "./middleware/auth.middleware.ts";
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(authMiddleware);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/boards/", boardRouter)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`\n🪐 [SERVER RUNNING]: Open your browser and navigate to http://localhost:${PORT}`);
  console.log(`👉 Test the API data dump directly at http://localhost:${PORT}/api/boards/\n`);
})