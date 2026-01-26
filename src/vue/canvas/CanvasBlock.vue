<template>
  <div
    class="ee-canvas-block"
    :class="{ 'ee-selected': selected }"
    @click.stop="$emit('select')"
  >
    <div class="ee-block-controls" v-if="selected">
      <div class="ee-drag-handle" draggable="true" @dragstart="$emit('dragstart', $event)">
        ⋮⋮
      </div>
      <button class="ee-delete-btn" @click.stop="$emit('delete')">×</button>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selected: boolean;
}>();

defineEmits<{
  (event: "select"): void;
  (event: "delete"): void;
  (event: "dragstart", e: DragEvent): void;
}>();
</script>

<style scoped>
.ee-canvas-block {
  position: relative;
  border: 2px solid transparent;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.ee-canvas-block:hover {
  border-color: rgba(0, 0, 0, 0.1);
}

.ee-canvas-block.ee-selected {
  border-color: #2196f3;
}

.ee-block-controls {
  position: absolute;
  top: -24px;
  right: 0;
  display: flex;
  gap: 4px;
  background: #2196f3;
  border-radius: 4px 4px 0 0;
  padding: 2px 4px;
  z-index: 10;
}

.ee-drag-handle {
  cursor: grab;
  color: white;
  padding: 0 4px;
  user-select: none;
}

.ee-delete-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 4px;
}
</style>
