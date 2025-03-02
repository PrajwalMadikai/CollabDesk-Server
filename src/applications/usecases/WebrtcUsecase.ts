import { Server, Socket } from "socket.io";

export class WebRTCUsecase {
  private rooms: Map<string, Set<string>> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    console.log("WebRTC signaling server initialized");
  }

  executeSocket(socket: Socket): void {
    console.log(`New connection established: ${socket.id}`);

    // Check if room exists
    socket.on('check-room', (roomId) => {
      console.log(`Checking room ${roomId} for ${socket.id}`);
      if (this.rooms.has(roomId) && this.rooms.get(roomId)!.size > 0) {
        const participants = Array.from(this.rooms.get(roomId)!);
        console.log(`Room ${roomId} exists with participants: ${participants.join(', ')}`);
        socket.emit('room-exists', participants);
      } else {
        console.log(`Room ${roomId} does not exist, creating new room`);
        socket.emit('create-room');
      }
    });

    // Check room status (for the button component)
    socket.on('check-room-status', (roomId) => {
      const roomExists = this.rooms.has(roomId);
      const participants = roomExists ? this.rooms.get(roomId)!.size : 0;

      console.log(`Room status check for ${roomId}: active=${roomExists && participants > 0}, participants=${participants}`);
      socket.emit('room-status', {
        active: roomExists && participants > 0,
        participants
      });
    });

    // Create a new room
    socket.on('create-room', (roomId) => {
      console.log(`Creating room ${roomId} by ${socket.id}`);
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set([socket.id]));
      } else {
        this.rooms.get(roomId)!.add(socket.id);
      }

      socket.join(roomId);
      this.broadcastRoomStatus(roomId);
    });

    // Join an existing room
    socket.on('join-room', (roomId) => {
      console.log(`${socket.id} joining room ${roomId}`);
      socket.join(roomId);

      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set([socket.id]));
      } else {
        this.rooms.get(roomId)!.add(socket.id);
      }

      socket.to(roomId).emit('user-joined', socket.id);
      this.broadcastRoomStatus(roomId);
    });

    // Handle WebRTC signaling events
    socket.on('offer', ({ offer, to }) => {
      console.log(`Forwarding offer from ${socket.id} to ${to}`);
      socket.to(to).emit('offer', {
        offer,
        from: socket.id
      });
    });

    socket.on('answer', ({ answer, to }) => {
      console.log(`Forwarding answer from ${socket.id} to ${to}`);
      socket.to(to).emit('answer', {
        answer,
        from: socket.id
      });
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
      console.log(`Forwarding ICE candidate from ${socket.id} to ${to}`);
      socket.to(to).emit('ice-candidate', {
        candidate,
        from: socket.id
      });
    });

    // Handle chat messages
    socket.on('chat-message', ({ message, room }) => {
      console.log(`Chat message in room ${room} from ${socket.id}: ${message.text.substring(0, 20)}${message.text.length > 20 ? '...' : ''}`);
      socket.to(room).emit('chat-message', message);
    });

    // Handle video/audio state updates
    socket.on('media-state-change', ({ type, enabled, room }) => {
      console.log(`${socket.id} ${type} state changed to ${enabled ? 'enabled' : 'disabled'} in room ${room}`);
      socket.to(room).emit('media-state-change', {
        userId: socket.id,
        type,
        enabled
      });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);

    // Find all rooms this user was in
    for (const [roomId, participants] of this.rooms.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        console.log(`Removed ${socket.id} from room ${roomId}, remaining participants: ${participants.size}`);

        socket.to(roomId).emit('user-left', socket.id);

        if (participants.size === 0) {
          console.log(`Room ${roomId} is now empty, removing it`);
          this.rooms.delete(roomId);
        }

        this.broadcastRoomStatus(roomId);
      }
    }
  }

  private broadcastRoomStatus(roomId: string): void {
    const room = this.rooms.get(roomId);
    const status = {
      workspaceId: roomId,
      active: room && room.size > 0,
      participants: room ? room.size : 0
    };

    console.log(`Broadcasting room status update for ${roomId}: ${JSON.stringify(status)}`);
    this.io.emit('room-status-update', status);
  }

  getAllRooms(): { roomId: string, participants: number }[] {
    const roomInfo = [];
    for (const [roomId, participants] of this.rooms.entries()) {
      if (participants.size > 0) {
        roomInfo.push({
          roomId,
          participants: participants.size
        });
      }
    }
    return roomInfo;
  }
}