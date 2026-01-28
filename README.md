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

## Custom blocks

Register custom blocks to appear in the picker and render with your own HTML.

```ts
import {
  registerCustomBlock,
  createCustomBlockInstance,
  serializeDocument
} from "email-editor";

registerCustomBlock({
  id: "hero",
  displayName: "Hero",
  category: "Marketing",
  settingsSchema: {
    fields: [
      { key: "headline", label: "Headline", type: "string", required: true, default: "Hello" },
      { key: "ctaUrl", label: "CTA URL", type: "url", required: true, default: "https://example.com" }
    ]
  },
  defaultConfig: { headline: "Hello", ctaUrl: "https://example.com" },
  validate(config) {
    const missingFields: string[] = [];
    if (!config.headline) missingFields.push("headline");
    if (!config.ctaUrl) missingFields.push("ctaUrl");
    return { ok: missingFields.length === 0, missingFields };
  },
  renderHtml(config) {
    return `<div class=\"hero\"><h1>${config.headline}</h1><a href=\"${config.ctaUrl}\">Learn more</a></div>`;
  }
});

const customBlock = createCustomBlockInstance("hero", { headline: "Welcome" });
const documentJson = serializeDocument({
  id: "doc-1",
  layout: { previewMode: "desktop", previewWidthPx: 640 },
  blocks: [customBlock]
});
```

Settings schema field types: `string`, `number`, `boolean`, `color`, `select`, `url`, `html`, `richtext`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run lint`
- `npm run typecheck`
