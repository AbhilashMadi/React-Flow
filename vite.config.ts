import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

import dsv from "@rollup/plugin-dsv"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dsv()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "src/components/ui")
    }
  }
})
