import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme:
    typeof window !== "undefined"
      ? localStorage.getItem("app-theme") || "night"
      : "night",

  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-theme", theme);
    }
    set({ theme });
  },
}));
