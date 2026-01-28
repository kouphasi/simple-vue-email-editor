<template>
  <div v-if="hasIssues" class="ee-validation-summary">
    <div v-if="missingFields.length" class="ee-validation-section">
      <div class="ee-validation-title">Missing required fields</div>
      <ul class="ee-validation-list">
        <li v-for="field in missingFields" :key="field">{{ field }}</li>
      </ul>
    </div>

    <div v-if="errors.length" class="ee-validation-section">
      <div class="ee-validation-title">Validation errors</div>
      <ul class="ee-validation-list">
        <li v-for="(error, index) in errors" :key="`${error.field}-${index}`">
          <strong>{{ error.field }}</strong>: {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ValidationError } from "../../core/types";

const props = defineProps<{
  missingFields: string[];
  errors: ValidationError[];
}>();

const hasIssues = computed(
  () => props.missingFields.length > 0 || props.errors.length > 0
);
</script>

<style scoped>
.ee-validation-summary {
  border: 1px solid #f59e0b;
  background: #fffbeb;
  padding: 12px;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ee-validation-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ee-validation-list {
  margin: 6px 0 0 16px;
  padding: 0;
  font-size: 13px;
}
</style>
