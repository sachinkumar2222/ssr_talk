import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = "https://ssr-talk.onrender.com"

export const useSocketStore = create((set, get) => ({
  onlineUsers: [],
  socket: null,

  connectSocket: (authUser) => {
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket; 
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
