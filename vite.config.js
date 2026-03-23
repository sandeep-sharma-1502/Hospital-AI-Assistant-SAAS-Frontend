import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    exclude: ["sherpa-onnx-wasm"],
  },

  build: {
    commonjsOptions: {
      include: [/sherpa-onnx-wasm/, /node_modules/],
    },
  },
});