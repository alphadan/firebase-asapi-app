import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // Keeps it compatible with your firebase.json
  },
  server: {
    port: 3000,
    open: true,
  },
});
