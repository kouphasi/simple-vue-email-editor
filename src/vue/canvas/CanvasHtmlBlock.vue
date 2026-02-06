<template>
  <div class="ee-canvas-html-block">
    <div 
      v-if="block.content" 
      v-html="sanitizedContent"
      class="ee-html-preview"
    ></div>
    <div v-else class="ee-html-placeholder">
      Empty HTML Block
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HtmlBlock } from "../../core/types";
import { sanitizePreviewHtml } from "../../rendering/html_sanitizer";

const props = defineProps<{
  block: HtmlBlock;
}>();

const sanitizedContent = computed(() => sanitizePreviewHtml(props.block.content));
</script>

<style scoped>
.ee-canvas-html-block {
  /* No default styles to avoid interfering with HTML content */
  display: block;
}

.ee-html-placeholder {
  padding: 24px;
  background: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  color: #9ca3af;
  text-align: center;
  font-size: 14px;
  font-style: italic;
}
</style>
