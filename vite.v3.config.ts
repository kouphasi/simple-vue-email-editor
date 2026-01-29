import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as compiler from "@vue/compiler-sfc-vue3";

export default defineConfig({
  plugins: [vue({ compiler })],
  resolve: {
    alias: {
      vue: "vue3",
      "@vue/compiler-sfc": "@vue/compiler-sfc-vue3"
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests-vue3/**/*.{test,spec}.{ts,tsx,vue}"],
    setupFiles: "tests/setup-vue3.ts"
  }
});
