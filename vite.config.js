import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "./", // This ensures relative paths are used
  publicDir: "public", // Explicitly set the public directory
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.mp4"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
