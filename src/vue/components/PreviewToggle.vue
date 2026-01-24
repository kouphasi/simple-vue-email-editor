<template>
  <div class="ee-preview-toggle">
    <button
      type="button"
      class="ee-pill"
      :class="{ 'is-active': mode === 'desktop' }"
      @click="emit('change', 'desktop')"
    >
      Desktop
    </button>
    <button
      type="button"
      class="ee-pill"
      :class="{ 'is-active': mode === 'mobile' }"
      @click="emit('change', 'mobile')"
    >
      Mobile
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PreviewMode } from "../../core/types";

defineProps<{
  mode: PreviewMode;
}>();

const emit = defineEmits<{
  (event: "change", mode: PreviewMode): void;
}>();
</script>

<style scoped>
.ee-preview-toggle {
  display: flex;
  gap: 8px;
}

.ee-pill {
  border: 1px solid var(--ee-border);
  background: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.ee-pill.is-active {
  background: var(--ee-primary);
  color: #fff;
  border-color: var(--ee-primary);
}
</style>
