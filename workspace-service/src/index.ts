import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/connection";
import { errorHandler } from "./presentation/middleware/errorHandler";
import directoryRoute from "./presentation/routes/directoryRoute";
import fileRoute from "./presentation/routes/fileRoute";
import workspaceRoute from "./presentation/routes/workspaceRoute";
import { handleFolderRemoveCronjobs, setupDeleteExpiredFilesCron } from "./presentation/utils/cronJobs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

connectDB().then(() => {
  setupDeleteExpiredFilesCron();
  handleFolderRemoveCronjobs();
});

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/workspace", workspaceRoute);
app.use("/folder", directoryRoute);
app.use("/file", fileRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Workspace service running on http://localhost:${PORT}`);
});
