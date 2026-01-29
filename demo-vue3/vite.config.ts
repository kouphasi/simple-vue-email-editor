import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
  resolve: {
    alias: {
      "email-editor": path.resolve(__dirname, "../src/index.ts"),
      vue: "vue3"
    }
  },
  server: {
    port: 5175,
    open: true
  }
});
