// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"], // force WebSocket
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};
