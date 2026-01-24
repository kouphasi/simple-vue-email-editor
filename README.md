# Email Editor Library

A block-based email editor library for Vue 2.7.

## Install

```bash
npm install email-editor
```

## Usage (Vue 2.7)

```vue
<script setup lang="ts">
import EmailEditor from "email-editor";
import { ref } from "vue";

const json = ref("");

const handleImageUpload = async (file: File) => {
  const url = await uploadImage(file);
  return url;
};
</script>

<template>
  <EmailEditor v-model="json" :on-image-upload="handleImageUpload" />
</template>
```

## Notes

- `v-model` is a JSON string representation of the document.
- You can pass a `document` object instead of `v-model` if you want to own state externally.

## Scripts

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run lint`
- `npm run typecheck`
