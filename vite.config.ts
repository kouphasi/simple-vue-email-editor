import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue2()],
  build: {
    target: "es2022",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: "EmailEditor",
      formats: ["es", "iife"],
      fileName: (format) => `email-editor.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
