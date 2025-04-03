import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import { SocketUsecase } from "./applications/usecases/SocketUsecase";
import { connectDB } from "./database/connection";
import { errorHandler } from "./presentation/middleware/errorHandler";
import adminRoute from "./presentation/routes/adminRoute";
import folderRoute from "./presentation/routes/directoryRoute";
import fileRoute from './presentation/routes/fileRoute';
import userRoute from "./presentation/routes/userRoute";
import workspaceRoute from "./presentation/routes/workspaceRoute";
import { handleFolderRemoveCronjobs, setupDeleteExpiredFilesCron } from "./presentation/utils/cronJobs";
import { FileRepository } from "./respository/fileRepository";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5713;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const fileRepository = new FileRepository();
const socketUsecase = new SocketUsecase(fileRepository);

socketUsecase.setIo(io);

connectDB().then(() => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    socketUsecase.executeSocket(socket);
  });

  setupDeleteExpiredFilesCron(); // Cron job function for deleting files
  handleFolderRemoveCronjobs(); // Cron job function for deleting folders
});

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoute);
app.use("/workspace", workspaceRoute);
app.use("/admin", adminRoute);
app.use("/folder", folderRoute);
app.use('/file', fileRoute);

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});