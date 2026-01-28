# API Reference

Complete reference for the Email Editor library's public API.

## EmailEditor Component

The main Vue component for rendering the email editor.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `json` | `string` | `undefined` | JSON-serialized document to load |
| `document` | `Document \| null` | `undefined` | Document object to load directly |
| `previewMode` | `'mobile' \| 'desktop'` | `'desktop'` | Preview mode for the canvas |
| `onImageUpload` | `ImageUploadHandler` | `undefined` | Handler function for image uploads |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:json` | `string` | Emitted when the document changes, with the JSON string |
| `change` | `Document` | Emitted when the document changes, with the Document object |
| `error` | `Error` | Emitted when validation or loading errors occur |

### Exposed Methods

Access these methods via a template ref:

```vue
<template>
  <EmailEditor ref="editor" />
</template>

<script setup>
const editor = ref(null)
// Access: editor.value.exportHtml()
</script>
```

#### `loadJson(json: string): void`

Load a document from a JSON string.

```typescript
editor.value.loadJson('{"id":"doc-1","blocks":[],"layout":{...}}')
```

#### `loadDocument(doc: Document): void`

Load a document from a Document object.

```typescript
editor.value.loadDocument({
  id: 'doc-1',
  blocks: [],
  layout: { previewMode: 'desktop', previewWidthPx: 640 }
})
```

#### `exportJson(): string`

Export the current document as a JSON string.

```typescript
const json = editor.value.exportJson()
// Returns: '{"id":"doc-1","blocks":[...],"layout":{...}}'
```

#### `exportHtml(): string`

Export the current document as email-ready HTML.

```typescript
const html = editor.value.exportHtml()
// Returns complete HTML document with inline styles
```

---

## Types

### Document

The root document structure.

```typescript
interface Document {
  id: string
  blocks: Block[]
  layout: LayoutSettings
}
```

### LayoutSettings

Document layout configuration.

```typescript
interface LayoutSettings {
  previewMode: 'mobile' | 'desktop'
  previewWidthPx: 375 | 640
}
```

### Block

Union type of all block types.

```typescript
type Block = TextBlock | ButtonBlock | ImageBlock | HtmlBlock | CustomBlockInstance
```

### TextBlock

```typescript
interface TextBlock {
  type: 'text'
  id: string
  text: string
  runs: TextRun[]
  align: 'left' | 'center' | 'right'
}

interface TextRun {
  start: number
  end: number
  bold?: boolean
  color?: string  // Hex color (#RGB or #RRGGBB)
}
```

### ButtonBlock

```typescript
interface ButtonBlock {
  type: 'button'
  id: string
  label: string
  url: string
  shape: 'square' | 'rounded' | 'pill'
  color: string      // Background color (hex)
  textColor: string  // Text color (hex)
  align: 'left' | 'center' | 'right'
}
```

### ImageBlock

```typescript
interface ImageBlock {
  type: 'image'
  id: string
  src: string
  alt: string
  width?: number
  height?: number
  align: 'left' | 'center' | 'right'
  status: 'pending' | 'ready' | 'uploading' | 'error'
}
```

### HtmlBlock

```typescript
interface HtmlBlock {
  type: 'html'
  id: string
  content: string  // Raw HTML content
}
```

### ImageUploadHandler

```typescript
type ImageUploadHandler = (file: File) => Promise<string>
```

A function that receives a File object and returns a Promise resolving to the uploaded image URL.

---

## Functions

### Document Serialization

#### `serializeDocument(doc: Document): string`

Convert a Document object to a JSON string.

```typescript
import { serializeDocument } from 'email-editor'

const json = serializeDocument(document)
```

#### `parseDocument(json: string): Document`

Parse a JSON string into a Document object. Throws on invalid input.

```typescript
import { parseDocument } from 'email-editor'

try {
  const document = parseDocument(jsonString)
} catch (error) {
  console.error('Invalid document:', error.message)
}
```

#### `validateDocument(doc: Document): ValidationResult`

Validate a Document object's structure and content.

```typescript
import { validateDocument } from 'email-editor'

const result = validateDocument(document)
if (!result.ok) {
  console.error('Validation errors:', result.errors)
}
```

### HTML Export

#### `exportHtml(doc: Document): string`

Render a Document to email-ready HTML with inline styles.

```typescript
import { exportHtml } from 'email-editor'

const html = exportHtml(document)
```

---

## Custom Block Functions

See [Custom Blocks](./custom-blocks.md) for detailed usage.

### `registerCustomBlock(definition: CustomBlockDefinition): void`

Register a custom block definition globally.

```typescript
import { registerCustomBlock } from 'email-editor'

registerCustomBlock({
  id: 'hero',
  displayName: 'Hero Section',
  settingsSchema: { fields: [...] },
  defaultConfig: { ... },
  validate: (config) => ({ ok: true, missingFields: [] }),
  renderHtml: (config) => '<div>...</div>'
})
```

### `getCustomBlockDefinition(id: string): CustomBlockDefinition | undefined`

Retrieve a registered custom block definition by ID.

```typescript
import { getCustomBlockDefinition } from 'email-editor'

const definition = getCustomBlockDefinition('hero')
```

### `listCustomBlockDefinitions(): CustomBlockDefinition[]`

Get all registered custom block definitions.

```typescript
import { listCustomBlockDefinitions } from 'email-editor'

const definitions = listCustomBlockDefinitions()
```

### `subscribeCustomBlockDefinitions(callback: (definitions: CustomBlockDefinition[]) => void): () => void`

Subscribe to changes in registered custom block definitions. Returns an unsubscribe function.

```typescript
import { subscribeCustomBlockDefinitions } from 'email-editor'

const unsubscribe = subscribeCustomBlockDefinitions((definitions) => {
  console.log('Definitions updated:', definitions)
})

// Later: unsubscribe()
```

### `createCustomBlockInstance(definitionId: string, configOverrides?: object): CustomBlockInstance`

Create a new instance of a custom block with optional config overrides.

```typescript
import { createCustomBlockInstance } from 'email-editor'

const block = createCustomBlockInstance('hero', {
  headline: 'Welcome!'
})
```

---

## Validation Types

### ValidationResult

```typescript
interface ValidationResult {
  ok: boolean
  missingFields: string[]
  errors?: ValidationError[]
}
```

### ValidationError

```typescript
interface ValidationError {
  field: string
  message: string
  code?: string
}
```
