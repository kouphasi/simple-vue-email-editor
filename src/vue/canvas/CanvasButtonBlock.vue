<template>
  <div class="ee-canvas-button-block" :style="containerStyle" @click.stop="$emit('select')">
    <a
      :href="block.url"
      class="ee-button-element"
      :style="buttonStyle"
      @click.prevent
    >
      {{ block.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ButtonBlock } from "../../core/types";
import {
  DEFAULT_BUTTON_PADDING_HORIZONTAL_PX,
  DEFAULT_BUTTON_PADDING_VERTICAL_PX,
  DEFAULT_FONT_SIZE_PX
} from "../../core/validation";

const props = defineProps<{
  block: ButtonBlock;
  selected: boolean;
}>();

defineEmits<{
  (event: "select"): void;
}>();

const containerStyle = computed(() => {
  return {
    textAlign: props.block.align ?? "left"
  };
});

const buttonStyle = computed(() => {
  const radius =
    props.block.shape === "pill"
      ? "999px"
      : props.block.shape === "rounded"
        ? "8px"
        : "0";
  const paddingVertical =
    props.block.paddingVerticalPx ?? DEFAULT_BUTTON_PADDING_VERTICAL_PX;
  const paddingHorizontal =
    props.block.paddingHorizontalPx ?? DEFAULT_BUTTON_PADDING_HORIZONTAL_PX;

  return {
    backgroundColor: props.block.backgroundColor,
    color: props.block.textColor,
    borderRadius: radius,
    padding: `${paddingVertical}px ${paddingHorizontal}px`,
    display: "inline-block",
    textDecoration: "none",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: `${props.block.fontSize ?? DEFAULT_FONT_SIZE_PX}px`,
    lineHeight: "1.5",
    cursor: "pointer"
  };
});
</script>

<style scoped>
.ee-canvas-button-block {
  margin: 0 0 16px 0;
  /* Ensure clicks around the button also select if needed, or maybe just the button area? */
  /* The requirement says click to select. The wrapper CanvasBlock handles selection borders. */
}
</style>
