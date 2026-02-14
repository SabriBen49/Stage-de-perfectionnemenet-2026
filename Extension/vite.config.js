import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "popup.js",           // source file
      output: {
        entryFileNames: "popup.js",
        format: "iife",            // <-- IMPORTANT: wraps everything in an immediately-invoked function
      }
    }
  }
});
