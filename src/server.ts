import express from "express";
import cors from "cors";
import boardRouter from "./routes/boardRoutes.ts";
import { getWorkspaces } from "./controllers/workspaceController.ts";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/workspaces", getWorkspaces);
app.use("/api/boards/", boardRouter)

app.listen(PORT, () => {
  console.log(`\n🪐 [SERVER RUNNING]: Open your browser and navigate to http://localhost:${PORT}`);
  console.log(`👉 Test the API data dump directly at http://localhost:${PORT}/api/boards/\n`);
})