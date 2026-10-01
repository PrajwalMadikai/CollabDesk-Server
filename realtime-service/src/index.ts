import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import { SocketUsecase } from "./applications/usecases/SocketUsecase";
import { connectDB } from "./database/connection";
import { FileRepository } from "./respository/fileRepository";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

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

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

connectDB().then(() => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    socketUsecase.executeSocket(socket);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Realtime service running on http://localhost:${PORT}`);
});
