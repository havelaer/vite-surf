import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import surfPlugin, { virtualClientEntry } from "../dist/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: [virtualClientEntry],
    },
  },
  plugins: [surfPlugin(), react()],
});
