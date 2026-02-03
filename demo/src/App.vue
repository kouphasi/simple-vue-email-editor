<template>
  <div class="demo-shell">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Vue 2.7 Demo</p>
        <h1>Email Editor Playground</h1>
        <p class="sub">
          Add blocks, apply formatting, reorder with drag-and-drop, and export to the console.
        </p>
      </div>
      <div class="header-actions">
        <button class="action primary" type="button" @click="handleExportJson">
          Export JSON
        </button>
        <button class="action ghost" type="button" @click="handleExportHtml">
          Export HTML
        </button>
        <button class="action" type="button" @click="loadSample">Load Sample</button>
      </div>
    </header>

    <main class="demo-main">
      <section class="editor-panel">
        <EmailEditor
          ref="editorRef"
          :json="json"
          :on-image-upload="mockUpload"
          @update:json="handleJsonUpdate"
        />
      </section>
      <section class="bottom-panel">
        <div class="panel-card">
          <h2>JSON State</h2>
          <textarea v-model="json" spellcheck="false" rows="12"></textarea>
        </div>
        <div class="panel-card">
          <h2>Notes</h2>
          <ul>
            <li>Image uploads return a placeholder URL.</li>
            <li>Exports are logged to the console.</li>
            <li>Drag blocks to reorder.</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EmailEditor, {
  registerCustomBlock,
  serializeDocument
} from "email-editor";
import type { Document } from "email-editor";

const editorRef = ref<InstanceType<typeof EmailEditor> | null>(null);
const defaultDocument: Document = {
  id: "6ea2c487-7ecd-4bd5-bbeb-520ad6764c11",
  blocks: [
    {
      id: "ddead48f-933a-40a8-85ef-2ee161a6ac86",
      type: "text",
      text: "Simple Vue Email Editor",
      runs: [{ start: 0, end: 23, bold: true, color: "#00a303" }],
      fontSize: 26,
      align: "center"
    },
    {
      id: "126e6f33-9c8c-4573-b18d-7640b78d93a0",
      type: "image",
      url: "https://private-user-images.githubusercontent.com/89081817/544375423-af5ef402-86ff-49f8-9c2f-98f05d44d727.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzAxMjgzMTQsIm5iZiI6MTc3MDEyODAxNCwicGF0aCI6Ii84OTA4MTgxNy81NDQzNzU0MjMtYWY1ZWY0MDItODZmZi00OWY4LTljMmYtOThmMDVkNDRkNzI3LmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMjAzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDIwM1QxNDEzMzRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04YmUxNjQxMmY5ZjI0ZjVkNGY3ZThmMjgxZjEwODM1MWU4OGVlY2MzZWQ2NjMzYzUwMWI3ZjhkZWRiYTVmMjc2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.vR3jQb7PgI5-UqLmtYgmvAY67ejC2nSUAMBSYLQ58lg",
      status: "ready",
      display: {
        align: "center",
        widthPx: 322
      }
    },
    {
      id: "47853748-9607-4896-b37c-ab444114e9a2",
      type: "button",
      label: "view in Github",
      url: "https://example.com",
      shape: "rounded",
      textColor: "#ffffff",
      backgroundColor: "#00a302",
      fontSize: 16,
      align: "center"
    },
    {
      id: "4f8cb0b5-f49b-44eb-a73f-286ad245fa07",
      type: "custom",
      definitionId: "hero",
      config: {
        headline: "You Can Create An Original Block!",
        ctaUrl: "https://github.com/kouphasi/simple-vue-email-editor"
      },
      state: "ready",
      readOnly: false
    }
  ],
  layout: {
    previewMode: "mobile",
    previewWidthPx: 375
  }
};

const json = ref(serializeDocument(defaultDocument));

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

const mockUpload = async (): Promise<string> => {
  return "https://placehold.jp/2ccf20/ffffff/150x150.png?text=sample%20image";
};

const handleJsonUpdate = (value: string): void => {
  json.value = value;
};

const handleExportJson = (): void => {
  const output = editorRef.value?.exportJson();
  console.log("Export JSON:", output);
};

const handleExportHtml = (): void => {
  const output = editorRef.value?.exportHtml();
  console.log("Export HTML:", output);
};

const loadSample = (): void => {
  json.value = serializeDocument(defaultDocument);
};
</script>

<style scoped>
.demo-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.demo-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
  border-radius: 20px;
  background: #ffffffc8;
  border: 1px solid rgba(16, 24, 40, 0.08);
  box-shadow: 0 16px 40px rgba(31, 24, 17, 0.08);
  backdrop-filter: blur(8px);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 11px;
  color: #8c6b3c;
  margin: 0 0 8px 0;
}

h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
}

.sub {
  margin: 0;
  max-width: 540px;
  color: #4b463f;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
}

.action {
  border: 1px solid rgba(28, 27, 26, 0.2);
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action.primary {
  background: #f9c46a;
  border-color: #f9c46a;
}

.action.ghost {
  background: #f2f0ea;
}

.action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.12);
}

.demo-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}

.editor-panel {
  background: #ffffffb8;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  box-shadow: 0 16px 36px rgba(32, 27, 20, 0.08);
}

.bottom-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.panel-card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  box-shadow: 0 12px 24px rgba(31, 24, 17, 0.06);
}

.panel-card h2 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.panel-card textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(28, 27, 26, 0.2);
  padding: 12px;
  font-size: 12px;
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
  background: #faf9f5;
  color: #2e2a26;
}

.panel-card ul {
  padding-left: 18px;
  margin: 0;
  color: #4b463f;
  display: grid;
  gap: 6px;
}

@media (max-width: 980px) {
  .header-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .bottom-panel {
    grid-template-columns: 1fr;
  }
}
</style>
