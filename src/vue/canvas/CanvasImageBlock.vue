<template>
  <div class="ee-canvas-image-block" :style="containerStyle" @click.stop="$emit('select')">
    <img
      v-if="block.url && block.status === 'ready'"
      :src="block.url"
      alt=""
      :style="imageStyle"
      draggable="false"
    />
    <div v-else class="ee-image-placeholder">
      <span v-if="block.status === 'uploading'">Uploading...</span>
      <span v-else-if="block.status === 'error'">Error loading image</span>
      <span v-else>No image selected</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ImageBlock } from "../../core/types";

const props = defineProps<{
  block: ImageBlock;
  selected: boolean;
}>();

defineEmits<{
  (event: "select"): void;
}>();

const containerStyle = computed(() => {
  return {
    textAlign: props.block.display.align ?? "center",
    margin: "0 0 16px 0"
  };
});

const imageStyle = computed(() => {
  const width = props.block.display.widthPx
    ? `${props.block.display.widthPx}px`
    : "auto";
  const height = props.block.display.heightPx
    ? `${props.block.display.heightPx}px`
    : "auto";

  return {
    width,
    height,
    maxWidth: "100%",
    display: "inline-block", // To respect text-align of parent
    border: "none"
  };
});
</script>

<style scoped>
.ee-image-placeholder {
  width: 100%;
  height: 120px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
}
</style>
