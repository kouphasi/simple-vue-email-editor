<template>
  <div class="ee-settings-field">
    <label class="ee-settings-label" :for="inputId">
      {{ field.label }}
      <span v-if="field.required" class="ee-required">*</span>
    </label>

    <input
      v-if="isTextInput"
      :id="inputId"
      class="ee-settings-input"
      :type="inputType"
      :value="stringValue"
      @input="handleTextInput"
    />

    <input
      v-else-if="field.type === 'number'"
      :id="inputId"
      class="ee-settings-input"
      type="number"
      :value="numberValue"
      @input="handleNumberInput"
    />

    <input
      v-else-if="field.type === 'color'"
      :id="inputId"
      class="ee-settings-input ee-settings-color"
      type="color"
      :value="stringValue"
      @input="handleTextInput"
    />

    <select
      v-else-if="field.type === 'select'"
      :id="inputId"
      class="ee-settings-select"
      :value="selectValue"
      @change="handleSelectInput"
    >
      <option
        v-for="option in field.options ?? []"
        :key="String(option.value)"
        :value="String(option.value)"
      >
        {{ option.label }}
      </option>
    </select>

    <textarea
      v-else-if="isTextArea"
      :id="inputId"
      class="ee-settings-textarea"
      :value="stringValue"
      rows="4"
      @input="handleTextInput"
    ></textarea>

    <input
      v-else-if="field.type === 'boolean'"
      :id="inputId"
      class="ee-settings-checkbox"
      type="checkbox"
      :checked="booleanValue"
      @change="handleBooleanInput"
    />

    <p v-if="field.helpText" class="ee-settings-help">{{ field.helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SettingsField } from "../../core/types";

const props = defineProps<{
  field: SettingsField;
  value: unknown;
}>();

const emit = defineEmits<{
  (event: "update", value: unknown): void;
}>();

const inputId = computed(() => `custom-field-${props.field.key}`);

const isTextInput = computed(() =>
  ["string", "url"].includes(props.field.type)
);
const isTextArea = computed(() =>
  ["html", "richtext"].includes(props.field.type)
);

const inputType = computed(() => {
  if (props.field.type === "url") {
    return "url";
  }
  return "text";
});

const stringValue = computed(() => (props.value == null ? "" : String(props.value)));
const numberValue = computed(() => (typeof props.value === "number" ? props.value : ""));
const booleanValue = computed(() => Boolean(props.value));
const selectValue = computed(() => (props.value == null ? "" : String(props.value)));

const handleTextInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update", target.value);
};

const handleNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.value === "") {
    emit("update", undefined);
    return;
  }
  emit("update", Number(target.value));
};

const handleBooleanInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update", target.checked);
};

const handleSelectInput = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const rawValue = target.value;
  const option = props.field.options?.find((item) => String(item.value) === rawValue);
  emit("update", option ? option.value : rawValue);
};
</script>

<style scoped>
.ee-settings-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ee-settings-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.ee-required {
  color: #dc2626;
  margin-left: 4px;
}

.ee-settings-input,
.ee-settings-select,
.ee-settings-textarea {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  color: #111827;
  background: #fff;
}

.ee-settings-input:focus,
.ee-settings-select:focus,
.ee-settings-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.ee-settings-color {
  padding: 0;
  height: 36px;
}

.ee-settings-checkbox {
  width: 16px;
  height: 16px;
}

.ee-settings-help {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}
</style>
