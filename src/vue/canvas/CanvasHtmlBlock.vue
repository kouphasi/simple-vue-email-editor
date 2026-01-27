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

const props = defineProps<{
  block: HtmlBlock;
}>();

const BLOCKED_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form"
].join(",");

const URL_ATTRS = new Set(["href", "src", "xlink:href", "formaction"]);
const JAVASCRIPT_URL_RE = /^\s*javascript:/i;

function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let currentNode = walker.currentNode as Element | null;

  while (currentNode) {
    for (const attr of Array.from(currentNode.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (name.startsWith("on")) {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (name === "style") {
        currentNode.removeAttribute(attr.name);
        continue;
      }

      if (URL_ATTRS.has(name) && JAVASCRIPT_URL_RE.test(value)) {
        currentNode.removeAttribute(attr.name);
      }
    }

    currentNode = walker.nextNode() as Element | null;
  }

  return doc.body.innerHTML;
}

const sanitizedContent = computed(() => sanitizeHtml(props.block.content));
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
