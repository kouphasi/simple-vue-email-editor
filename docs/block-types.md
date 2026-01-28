# Block Types

The Email Editor includes four built-in block types that cover common email content needs.

## Text Block

The text block displays formatted text content with support for bold styling, colors, and alignment.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | The plain text content |
| `runs` | `TextRun[]` | Formatting runs for styling portions of text |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |

### Text Runs

Text runs define formatting for character ranges within the text. Each run specifies:

- `start`: Starting character index (inclusive)
- `end`: Ending character index (exclusive)
- `bold`: Whether the text is bold (optional)
- `color`: Hex color code (optional)

```typescript
// Example: "Hello World" with "World" in bold red
{
  type: 'text',
  id: 'text-1',
  text: 'Hello World',
  runs: [
    { start: 6, end: 11, bold: true, color: '#ff0000' }
  ],
  align: 'left'
}
```

### Features

- Select text in the editor to apply bold or color formatting
- Runs are automatically merged and normalized
- Empty or invalid runs are cleaned up on edit

---

## Button Block

The button block creates a clickable call-to-action element.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Button text |
| `url` | `string` | Link URL (must be http:// or https://) |
| `shape` | `'square' \| 'rounded' \| 'pill'` | Button corner style |
| `color` | `string` | Background color (hex) |
| `textColor` | `string` | Text color (hex) |
| `align` | `'left' \| 'center' \| 'right'` | Button alignment |

### Example

```typescript
{
  type: 'button',
  id: 'button-1',
  label: 'Shop Now',
  url: 'https://example.com/shop',
  shape: 'rounded',
  color: '#2b6cb0',
  textColor: '#ffffff',
  align: 'center'
}
```

### Shape Options

- **square**: No border radius (sharp corners)
- **rounded**: Moderate border radius (4px)
- **pill**: Maximum border radius (fully rounded ends)

---

## Image Block

The image block displays images with configurable dimensions and alignment.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | Image URL |
| `alt` | `string` | Alternative text for accessibility |
| `width` | `number` | Optional width in pixels |
| `height` | `number` | Optional height in pixels |
| `align` | `'left' \| 'center' \| 'right'` | Image alignment |
| `status` | `'pending' \| 'ready' \| 'uploading' \| 'error'` | Upload status |

### Example

```typescript
{
  type: 'image',
  id: 'image-1',
  src: 'https://example.com/hero.jpg',
  alt: 'Hero image',
  width: 600,
  height: 400,
  align: 'center',
  status: 'ready'
}
```

### Upload Status

The status property tracks the image upload lifecycle:

1. **pending**: Initial state, no image selected
2. **uploading**: File is being uploaded
3. **ready**: Upload complete, image is available
4. **error**: Upload failed

### Image Upload Handler

Provide an `onImageUpload` prop to the EmailEditor to handle file uploads:

```typescript
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  const { url } = await response.json()
  return url  // Return the uploaded image URL
}
```

---

## HTML Block

The HTML block allows embedding raw HTML content for advanced customization.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `content` | `string` | Raw HTML content |

### Example

```typescript
{
  type: 'html',
  id: 'html-1',
  content: '<table><tr><td>Custom HTML content</td></tr></table>'
}
```

### Use Cases

- Embedding complex layouts not supported by other block types
- Including third-party widgets or tracking pixels
- Adding custom styling or scripts

### Important Notes

- HTML content is rendered directly without sanitization
- Ensure you trust the source of HTML content
- Test HTML content across email clients for compatibility

---

## Block Alignment

All blocks except HTML support alignment through the `align` property:

| Value | Description |
|-------|-------------|
| `left` | Align content to the left |
| `center` | Center content horizontally |
| `right` | Align content to the right |

---

## Default Values

When creating new blocks, the editor applies these defaults:

### Text Block Defaults
```typescript
{
  text: '',
  runs: [],
  align: 'left'
}
```

### Button Block Defaults
```typescript
{
  label: 'Click Here',
  url: '',
  shape: 'rounded',
  color: '#2b6cb0',
  textColor: '#ffffff',
  align: 'center'
}
```

### Image Block Defaults
```typescript
{
  src: '',
  alt: '',
  align: 'center',
  status: 'pending'
}
```

### HTML Block Defaults
```typescript
{
  content: ''
}
```

---

## Block Operations

### Adding Blocks

Use the block picker in the editor sidebar to add new blocks. Click the "+" button or select from the available block types.

### Reordering Blocks

Drag and drop blocks in the canvas to reorder them. The editor provides visual feedback during drag operations.

### Editing Blocks

Click on a block in the canvas to select it. The properties sidebar will show editable options for the selected block.

### Deleting Blocks

Select a block and use the delete button in the properties sidebar to remove it.

---

## Next Steps

- Create [Custom Blocks](./custom-blocks.md) for specialized content
- See the [API Reference](./api-reference.md) for programmatic block manipulation
