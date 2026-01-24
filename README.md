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

const handleJsonUpdate = (value: string) => {
  json.value = value;
};

const handleImageUpload = async (file: File) => {
  const url = await uploadImage(file);
  return url;
};
</script>

<template>
  <EmailEditor :json="json" :on-image-upload="handleImageUpload" @update:json="handleJsonUpdate" />
</template>
```

## Notes

- `json` is a JSON string representation of the document.
- Use `update:json` to keep your local state in sync.
- You can pass a `document` object instead of `json` if you want to own state externally; handle `change` to capture edits.

## Scripts

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run lint`
- `npm run typecheck`
