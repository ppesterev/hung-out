import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  root: "src/client",
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime"
    }
  },
  build: {
    outDir: "../../dist/public",
    emptyOutDir: true
  },
  server: {
    proxy: {
      "/api": "http://localhost:9001"
    }
  }
});
