// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = io("https://quickshare-backend-n6qt.onrender.com", {
      transports: ["websocket"], // force WebSocket
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};
