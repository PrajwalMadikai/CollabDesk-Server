import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import path from "path";
import { Server } from "socket.io";
import { SocketUsecase } from "./applications/usecases/SocketUsecase";
import { WebRTCUsecase } from "./applications/usecases/WebrtcUsecase";
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
        methods: ["GET", "POST"],
    }
});

const fileRepository = new FileRepository()
const socketUsecase = new SocketUsecase(fileRepository)
const webRTCUsecase=new WebRTCUsecase(io)

connectDB().then(() => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socketUsecase.executeSocket(socket);
        webRTCUsecase.executeSocket(socket);
    });

    setupDeleteExpiredFilesCron() // cron job function for deleting files
    handleFolderRemoveCronjobs()// cron job function for deleting folders

});

app.use(cookieParser());
app.use(cors({ 
    origin: process.env.CLIENT_URL, 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "../presentation/public")));


app.use("/", userRoute);
app.use("/workspace", workspaceRoute);
app.use("/admin", adminRoute);
app.use("/folder", folderRoute);
app.use('/file', fileRoute);

app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});