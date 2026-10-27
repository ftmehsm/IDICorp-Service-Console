
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/IDICorp-Service-Console/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://ts.idicorp.ir",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "",
      },
      "/ws": {
        target: "wss://ts.idicorp.ir",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
});
