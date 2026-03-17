import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000", {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socket.on("connect",       () => console.info("[WS] connected:", socket?.id));
    socket.on("disconnect",    (r) => console.warn("[WS] disconnected:", r));
    socket.on("connect_error", (e) => console.error("[WS] error:", e.message));
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}