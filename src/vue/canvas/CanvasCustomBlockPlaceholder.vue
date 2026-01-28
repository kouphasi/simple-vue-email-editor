<template>
  <div class="ee-canvas-custom-placeholder">
    <div class="ee-canvas-title">{{ title }}: {{ definitionId }}</div>
    <div class="ee-canvas-note">Read-only (delete only)</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  definitionId: string;
  state: "missing-definition" | "invalid";
}>();

const title = computed(() =>
  props.state === "missing-definition" ? "Missing custom block" : "Invalid custom block"
);
</script>

<style scoped>
.ee-canvas-custom-placeholder {
  border: 1px dashed #f59e0b;
  background: #fffbeb;
  padding: 16px;
  border-radius: 12px;
  color: #92400e;
  text-align: center;
  font-size: 13px;
}

.ee-canvas-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.ee-canvas-note {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
</style>
