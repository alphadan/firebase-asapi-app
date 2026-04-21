import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // This automatically inlines CSS into the JS
  ],
  build: {
    outDir: "build",
    assetsInlineLimit: 100000000, // Force small assets/images to be inlined
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        uploader: resolve(__dirname, "src/uploader-entry.jsx"),
      },
      output: {
        // Disable code-splitting for the uploader so it's a single file
        manualChunks: undefined,
        entryFileNames: "[name].[hash].js",
      },
    },
  },
});
