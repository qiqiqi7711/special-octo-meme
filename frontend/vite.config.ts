import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 开发环境把 /api 代理到后端，避免跨域与密钥暴露
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
