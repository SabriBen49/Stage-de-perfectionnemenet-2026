import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "popup.js",          
      output: {
        entryFileNames: "popup.js",
        format: "iife",           
      }
    }
  }
});

