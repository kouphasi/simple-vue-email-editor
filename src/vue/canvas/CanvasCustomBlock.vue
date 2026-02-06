<template>
  <div class="ee-canvas-custom-block">
    <div class="ee-custom-preview" v-html="previewHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CustomBlockInstance } from "../../core/types";
import { renderBlockHtml } from "../../rendering/html_renderer";
import { sanitizePreviewHtml } from "../../rendering/html_sanitizer";

const props = defineProps<{
  block: CustomBlockInstance;
}>();

const previewHtml = computed(() =>
  sanitizePreviewHtml(renderBlockHtml(props.block, { mode: "preview" }), {
    stripStyleAttributes: false
  })
);
</script>

<style scoped>
.ee-canvas-custom-block {
  display: block;
}

.ee-custom-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
</style>
