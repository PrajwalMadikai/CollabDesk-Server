import { Server as IOServer, Socket } from "socket.io";
import { FileRepository } from "../../respository/fileRepository";

export class SocketUsecase {
  private io!: IOServer; 
  private activeRooms: { [roomName: string]: Set<string> } = {};
  private socketToRoomMap: { [socketId: string]: string } = {};
  private socketToUserMap: { [socketId: string]: string } = {};

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

    socket.on('subscribeToRoom', (roomName: string, userId?: string) => {
      socket.join(roomName);

      if (!this.activeRooms[roomName]) {
        this.activeRooms[roomName] = new Set();
      }

      // Store the mapping of socket to room
      this.socketToRoomMap[socket.id] = roomName;
      
      // Store user ID if provided
      if (userId) {
        this.socketToUserMap[socket.id] = userId;
      }

      this.broadcastParticipantCount(roomName);
    });

    socket.on('joinCall', (roomName: string, userId?: string) => {
      if (!this.activeRooms[roomName]) {
        this.activeRooms[roomName] = new Set();
      }
      
      // Add socket to active participants
      this.activeRooms[roomName].add(socket.id);
      
      // Store the mapping
      this.socketToRoomMap[socket.id] = roomName;
      
      if (userId) {
        this.socketToUserMap[socket.id] = userId;
      }

      this.broadcastParticipantCount(roomName);
      
      console.log(`User joined call in room ${roomName}. Total participants: ${this.activeRooms[roomName].size}`);
    });

    socket.on('leaveCall', (roomName: string) => {
      if (this.activeRooms[roomName]) {
        this.activeRooms[roomName].delete(socket.id);
        
        // Remove the mappings
        delete this.socketToRoomMap[socket.id];
        delete this.socketToUserMap[socket.id];

        if (this.activeRooms[roomName].size === 0) {
          delete this.activeRooms[roomName];
          console.log(`Room ${roomName} removed as it has no participants`);
        }
        
        this.broadcastParticipantCount(roomName);
        
        console.log(`User left call in room ${roomName}. Remaining participants: ${this.activeRooms[roomName]?.size || 0}`);
      }
    });

    socket.on('disconnect', () => {
      const roomName = this.socketToRoomMap[socket.id];
      
      if (roomName && this.activeRooms[roomName]) {
        this.activeRooms[roomName].delete(socket.id);
        
        delete this.socketToRoomMap[socket.id];
        delete this.socketToUserMap[socket.id];

        if (this.activeRooms[roomName].size === 0) {
          delete this.activeRooms[roomName];
          console.log(`Room ${roomName} removed as it has no participants after disconnect`);
        }
        
        this.broadcastParticipantCount(roomName);
        
        console.log(`User disconnected from room ${roomName}. Remaining participants: ${this.activeRooms[roomName]?.size || 0}`);
      }
    });
  }

  // Broadcast participant count to all clients in the room
  private broadcastParticipantCount(roomName: string): void {
    const participantCount = this.activeRooms[roomName]?.size || 0;
    this.io.to(roomName).emit('participantUpdate', { 
      room: roomName, 
      count: participantCount 
    });
    console.log(`Broadcasting participant count for room ${roomName}: ${participantCount}`);
  }
}