<template>
  <div class="ee-custom-placeholder">
    <div class="ee-custom-placeholder-title">{{ title }}: {{ definitionId }}</div>
    <div class="ee-custom-placeholder-note">Read-only (delete only)</div>
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
.ee-custom-placeholder {
  border: 1px dashed #f59e0b;
  background: #fffbeb;
  padding: 12px;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ee-custom-placeholder-title {
  font-weight: 700;
  font-size: 13px;
}

.ee-custom-placeholder-note {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
