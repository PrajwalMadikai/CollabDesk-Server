import { Server as IOServer, Socket } from "socket.io";
import { FileRepository } from "../../respository/fileRepository";

export class SocketUsecase {
  private io!: IOServer; 
  private activeRooms: { [roomName: string]: Set<string> } = {};
  private socketToRoomMap: { [socketId: string]: string } = {};  

  constructor(private fileRepository: FileRepository) {}

  // Method to set the io instance
  setIo(io: IOServer): void {
    this.io = io;
  }

  executeSocket(socket: Socket): void {
    socket.on('updateFile', async (data: any) => {
      try {
        if (!data?.id || !data?.content) {
          console.error("Invalid data received:", data);
          return;
        }
        const updatedFile = await this.fileRepository.updateFileContent(data.id, data.content);
        if (updatedFile) {
          socket.broadcast.emit('fileUpdated', {
            id: data.id,
            content: data.content,
          });
        }
      } catch (error) {
        console.error('Error in socket update content:', error);
      }
    });

    socket.on('subscribeToRoom', (roomName: string) => {
      socket.join(roomName);

      if (!this.activeRooms[roomName]) {
        this.activeRooms[roomName] = new Set();
      }
      this.activeRooms[roomName].add(socket.id);
      this.socketToRoomMap[socket.id] = roomName;

      this.broadcastParticipantCount(roomName);
    });

    socket.on('joinCall', (roomName: string) => {
      if (!this.activeRooms[roomName]) {
        this.activeRooms[roomName] = new Set();
      }
      this.activeRooms[roomName].add(socket.id);
      this.socketToRoomMap[socket.id] = roomName;

      // Broadcast updated participant count
      this.broadcastParticipantCount(roomName);
    });

    socket.on('leaveCall', (roomName: string) => {
      if (this.activeRooms[roomName]) {
        this.activeRooms[roomName].delete(socket.id);
        delete this.socketToRoomMap[socket.id];

        // If no participants are left, delete the room
        if (this.activeRooms[roomName].size === 0) {
          delete this.activeRooms[roomName];
        }
      }

      this.broadcastParticipantCount(roomName);
    });

    socket.on('disconnect', () => {

      const roomName = this.socketToRoomMap[socket.id];
      if (roomName && this.activeRooms[roomName]) {
        this.activeRooms[roomName].delete(socket.id);
        delete this.socketToRoomMap[socket.id];

        if (this.activeRooms[roomName].size === 0) {
          delete this.activeRooms[roomName];
        }

        this.broadcastParticipantCount(roomName);
      }
    });
  }

  // Broadcast participant count to all clients in the room
  private broadcastParticipantCount(roomName: string): void {
    const participantCount = this.activeRooms[roomName]?.size || 0;
    this.io.to(roomName).emit('participantUpdate', { room: roomName, count: participantCount });
  }
}