import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ ssrBuild }) => {
  if (ssrBuild) {
    // 🔹 SSR build
    return {
      plugins: [react()],
      build: {
        ssr: "src/entry-server.jsx",
        outDir: "dist-ssr", // SSR bundle
      },
    };
  } else {
    // 🔹 Client build
    return {
      plugins: [react()],
      build: {
        outDir: "dist",      // client bundle
        manifest: true,      // generate manifest.json for CSS/JS
        rollupOptions: {
          input: "/src/entry-client.jsx", // entry point for hydration
        },
      },
    };
  }
});
