import { Server } from "socket.io";
import http from "http";

const userSocketMap = {};
let io; // 👈 declare io here

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function createSocketServer(app) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return { server, io };
}

export { io }; // 👈 export it after setup
