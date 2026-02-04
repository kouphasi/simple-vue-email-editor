<template>
  <div class="ee-properties-panel">
    <div class="ee-panel-section">
      <h3>Button Properties</h3>
      
      <div class="ee-control-group">
        <label>Label</label>
        <input
          type="text"
          :value="block.label"
          @input="updateLabel"
          placeholder="Button Label"
        />
      </div>

      <div class="ee-control-group">
        <label>URL</label>
        <input
          type="url"
          :value="block.url"
          @input="updateUrl"
          placeholder="https://example.com"
        />
      </div>

      <div class="ee-control-group">
        <label>Font size</label>
        <input
          type="number"
          :min="FONT_SIZE_MIN_PX"
          :max="FONT_SIZE_MAX_PX"
          step="1"
          :value="block.fontSize ?? DEFAULT_FONT_SIZE_PX"
          @input="updateFontSize"
        />
      </div>

      <div class="ee-control-group">
        <label>Padding</label>
        <div class="ee-padding-controls">
          <div class="ee-padding-field">
            <span>Vertical</span>
            <input
              type="number"
              :min="BUTTON_PADDING_MIN_PX"
              :max="BUTTON_PADDING_MAX_PX"
              step="1"
              :value="paddingVertical"
              @input="updatePaddingVertical"
            />
          </div>
          <div class="ee-padding-field">
            <span>Horizontal</span>
            <input
              type="number"
              :min="BUTTON_PADDING_MIN_PX"
              :max="BUTTON_PADDING_MAX_PX"
              step="1"
              :value="paddingHorizontal"
              @input="updatePaddingHorizontal"
            />
          </div>
        </div>
        <label class="ee-checkbox">
          <input
            type="checkbox"
            :checked="block.paddingLocked ?? false"
            @change="updatePaddingLocked"
          />
          Lock ratio
        </label>
      </div>

      <div class="ee-control-group">
        <label>Shape</label>
        <div class="ee-shape-options">
          <button
            v-for="shape in shapes"
            :key="shape"
            type="button"
            :class="{ active: block.shape === shape }"
            @click="updateShape(shape)"
          >
            {{ shape }}
          </button>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Text Color</label>
        <div class="ee-color-input-wrapper">
          <input
            type="color"
            :value="block.textColor"
            @input="updateTextColor"
          />
          <span>{{ block.textColor }}</span>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Background Color</label>
        <div class="ee-color-input-wrapper">
          <input
            type="color"
            :value="block.backgroundColor"
            @input="updateBackgroundColor"
          />
          <span>{{ block.backgroundColor }}</span>
        </div>
      </div>

      <div class="ee-control-group">
        <label>Alignment</label>
        <div class="ee-align-options">
          <button
            type="button"
            :class="{ active: (block.align || 'left') === 'left' }"
            @click="updateAlign('left')"
          >
            Left
          </button>
          <button
            type="button"
            :class="{ active: (block.align || 'left') === 'center' }"
            @click="updateAlign('center')"
          >
            Center
          </button>
          <button
            type="button"
            :class="{ active: (block.align || 'left') === 'right' }"
            @click="updateAlign('right')"
          >
            Right
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { BlockAlign, ButtonBlock, ButtonShape } from "../../core/types";
import {
  BUTTON_PADDING_MAX_PX,
  BUTTON_PADDING_MIN_PX,
  DEFAULT_BUTTON_PADDING_HORIZONTAL_PX,
  DEFAULT_BUTTON_PADDING_VERTICAL_PX,
  DEFAULT_FONT_SIZE_PX,
  FONT_SIZE_MAX_PX,
  FONT_SIZE_MIN_PX
} from "../../core/validation";

const props = defineProps<{
  block: ButtonBlock;
}>();

const emit = defineEmits<{
  (event: "update", block: ButtonBlock): void;
}>();

const shapes: ButtonShape[] = ["square", "rounded", "pill"];

const paddingVertical = computed(() => {
  return props.block.paddingVerticalPx ?? DEFAULT_BUTTON_PADDING_VERTICAL_PX;
});

const paddingHorizontal = computed(() => {
  return props.block.paddingHorizontalPx ?? DEFAULT_BUTTON_PADDING_HORIZONTAL_PX;
});

const lockedPaddingRatio = ref<number | null>(null);

const clampPadding = (value: number): number => {
  return Math.min(BUTTON_PADDING_MAX_PX, Math.max(BUTTON_PADDING_MIN_PX, value));
};

const calculatePaddingRatio = (vertical: number, horizontal: number): number => {
  if (!Number.isFinite(vertical) || vertical <= 0) {
    return 1;
  }

  if (!Number.isFinite(horizontal) || horizontal <= 0) {
    return 1;
  }

  return horizontal / vertical;
};

const getLockedPaddingRatio = (): number => {
  if (lockedPaddingRatio.value != null && Number.isFinite(lockedPaddingRatio.value)) {
    return lockedPaddingRatio.value;
  }

  const vertical = paddingVertical.value;
  const horizontal = paddingHorizontal.value;
  const ratio = calculatePaddingRatio(vertical, horizontal);
  lockedPaddingRatio.value = ratio;
  return ratio;
};

watch(
  () => props.block.paddingLocked,
  (locked) => {
    if (locked) {
      lockedPaddingRatio.value = calculatePaddingRatio(
        paddingVertical.value,
        paddingHorizontal.value
      );
      return;
    }

    lockedPaddingRatio.value = null;
  },
  { immediate: true }
);

const updateLabel = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, label: input.value });
};

const updateUrl = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, url: input.value });
};

const updateFontSize = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.value.trim() === "") {
    emit("update", {
      ...props.block,
      fontSize: undefined
    });
    return;
  }

  const value = Number(input.value);
  emit("update", {
    ...props.block,
    fontSize: Number.isFinite(value) ? value : DEFAULT_FONT_SIZE_PX
  });
};

const updatePaddingVertical = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.value.trim() === "") {
    emit("update", {
      ...props.block,
      paddingVerticalPx: undefined,
      paddingHorizontalPx: props.block.paddingLocked ? undefined : props.block.paddingHorizontalPx
    });
    return;
  }

  const value = clampPadding(Number(input.value));
  if (props.block.paddingLocked) {
    const ratio = getLockedPaddingRatio();
    emit("update", {
      ...props.block,
      paddingVerticalPx: value,
      paddingHorizontalPx: clampPadding(Math.round(value * ratio))
    });
    return;
  }

  emit("update", { ...props.block, paddingVerticalPx: value });
};

const updatePaddingHorizontal = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.value.trim() === "") {
    emit("update", {
      ...props.block,
      paddingHorizontalPx: undefined,
      paddingVerticalPx: props.block.paddingLocked ? undefined : props.block.paddingVerticalPx
    });
    return;
  }

  const value = clampPadding(Number(input.value));
  if (props.block.paddingLocked) {
    const ratio = getLockedPaddingRatio();
    const nextVertical = ratio === 0 ? value : value / ratio;
    emit("update", {
      ...props.block,
      paddingHorizontalPx: value,
      paddingVerticalPx: clampPadding(Math.round(nextVertical))
    });
    return;
  }

  emit("update", { ...props.block, paddingHorizontalPx: value });
};

const updatePaddingLocked = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.checked) {
    lockedPaddingRatio.value = calculatePaddingRatio(
      paddingVertical.value,
      paddingHorizontal.value
    );
  }
  emit("update", { ...props.block, paddingLocked: input.checked });
};

const updateShape = (shape: ButtonShape) => {
  emit("update", { ...props.block, shape });
};

const updateTextColor = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, textColor: input.value });
};

const updateBackgroundColor = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update", { ...props.block, backgroundColor: input.value });
};

const updateAlign = (align: BlockAlign) => {
  emit("update", { ...props.block, align });
};
</script>

<style scoped>
.ee-properties-panel {
  padding: 16px;
}

.ee-panel-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #374151;
}

.ee-control-group {
  margin-bottom: 16px;
}

.ee-control-group label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.ee-control-group input[type="text"],
.ee-control-group input[type="url"],
.ee-control-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.ee-shape-options {
  display: flex;
  gap: 8px;
}

.ee-shape-options button {
  flex: 1;
  padding: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #374151;
  text-transform: capitalize;
}

.ee-shape-options button.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
  font-weight: 500;
}

.ee-color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  padding: 4px 8px;
  border-radius: 6px;
  background: #fff;
}

.ee-color-input-wrapper input[type="color"] {
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  cursor: pointer;
}

.ee-color-input-wrapper span {
  font-size: 13px;
  color: #4b5563;
  font-family: monospace;
}

.ee-padding-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
}

.ee-padding-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.ee-padding-field input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.ee-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.ee-checkbox input[type="checkbox"] {
  margin: 0;
}

.ee-align-options {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.ee-align-options button {
  flex: 1;
  border: none;
  background: #fff;
  padding: 6px 4px;
  font-size: 12px;
  cursor: pointer;
  color: #4b5563;
  border-right: 1px solid #e5e7eb;
}

.ee-align-options button:last-child {
  border-right: none;
}

.ee-align-options button.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}
</style>
