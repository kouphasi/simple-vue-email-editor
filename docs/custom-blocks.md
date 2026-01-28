# Custom Blocks

Extend the Email Editor with your own block types to support specialized content needs.

## Overview

Custom blocks allow you to:

- Define new block types with custom configuration schemas
- Specify validation rules for block settings
- Control how blocks render to HTML for email export
- Integrate domain-specific content into your emails

## Registering a Custom Block

Use `registerCustomBlock` to define a new block type:

```typescript
import { registerCustomBlock } from 'email-editor'

registerCustomBlock({
  id: 'hero',
  displayName: 'Hero Section',
  settingsSchema: {
    fields: [
      {
        key: 'headline',
        label: 'Headline',
        type: 'string',
        required: true,
        default: 'Welcome',
        helpText: 'Main heading text'
      },
      {
        key: 'subheadline',
        label: 'Subheadline',
        type: 'string',
        required: false,
        default: ''
      },
      {
        key: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        default: '#f7fafc'
      },
      {
        key: 'ctaUrl',
        label: 'CTA Link',
        type: 'url',
        required: true
      }
    ]
  },
  defaultConfig: {
    headline: 'Welcome to Our Newsletter',
    subheadline: 'Stay updated with the latest news',
    backgroundColor: '#f7fafc',
    ctaUrl: 'https://example.com'
  },
  validate(config) {
    const errors = []
    const missingFields = []

    if (!config.headline) {
      missingFields.push('headline')
    }
    if (!config.ctaUrl) {
      missingFields.push('ctaUrl')
    }

    return {
      ok: missingFields.length === 0 && errors.length === 0,
      missingFields,
      errors
    }
  },
  renderHtml(config, context) {
    return `
      <table width="100%" style="background-color: ${config.backgroundColor}; padding: 40px;">
        <tr>
          <td align="center">
            <h1 style="margin: 0; font-size: 32px; color: #1a202c;">
              ${config.headline}
            </h1>
            ${config.subheadline ? `
              <p style="margin: 16px 0 0; font-size: 18px; color: #4a5568;">
                ${config.subheadline}
              </p>
            ` : ''}
          </td>
        </tr>
      </table>
    `
  }
})
```

## Custom Block Definition

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the block type |
| `displayName` | `string` | Human-readable name shown in the UI |
| `settingsSchema` | `SettingsSchema` | Schema defining configurable fields |
| `defaultConfig` | `object` | Default values for new block instances |
| `validate` | `function` | Validation function for block configuration |
| `renderHtml` | `function` | Function to render block as HTML |

### Settings Schema

The schema defines the configurable fields for your custom block:

```typescript
interface SettingsSchema {
  fields: SettingsField[]
}

interface SettingsField {
  key: string           // Unique field identifier
  label: string         // Display label in the UI
  type: FieldType       // Field type (see below)
  required?: boolean    // Whether the field is required
  default?: any         // Default value
  helpText?: string     // Helper text shown in the UI
  // Type-specific constraints
  min?: number          // Minimum value (number) or length (string)
  max?: number          // Maximum value (number) or length (string)
  pattern?: string      // Regex pattern for validation (string)
  options?: Option[]    // Options for select fields
}
```

### Field Types

| Type | Description | Constraints |
|------|-------------|-------------|
| `string` | Text input | `min`, `max`, `pattern` |
| `number` | Numeric input | `min`, `max` |
| `boolean` | Checkbox toggle | - |
| `color` | Color picker | Validates hex format |
| `url` | URL input | Validates http/https |
| `select` | Dropdown menu | `options` required |
| `html` | HTML editor | - |
| `richtext` | Rich text editor | - |

### Select Field Options

For `select` type fields, provide an `options` array:

```typescript
{
  key: 'alignment',
  label: 'Alignment',
  type: 'select',
  options: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ],
  default: 'center'
}
```

## Validation Function

The `validate` function receives the block's configuration and returns a validation result:

```typescript
interface ValidationResult {
  ok: boolean              // Whether validation passed
  missingFields: string[]  // Keys of missing required fields
  errors?: ValidationError[]  // Additional validation errors
}

interface ValidationError {
  field: string    // Field key
  message: string  // Error message
  code?: string    // Optional error code
}
```

Example with custom validation:

```typescript
validate(config) {
  const missingFields = []
  const errors = []

  // Check required fields
  if (!config.headline) {
    missingFields.push('headline')
  }

  // Custom validation
  if (config.headline && config.headline.length > 100) {
    errors.push({
      field: 'headline',
      message: 'Headline must be 100 characters or less',
      code: 'MAX_LENGTH'
    })
  }

  if (config.imageUrl && !config.imageUrl.startsWith('https://')) {
    errors.push({
      field: 'imageUrl',
      message: 'Image URL must use HTTPS',
      code: 'INVALID_PROTOCOL'
    })
  }

  return {
    ok: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors
  }
}
```

## Render Function

The `renderHtml` function converts block configuration to HTML:

```typescript
renderHtml(config: object, context?: RenderContext): string

interface RenderContext {
  mode: 'preview' | 'export'
}
```

Use the `context.mode` to differentiate between preview and export rendering:

```typescript
renderHtml(config, context) {
  const isPreview = context?.mode === 'preview'

  return `
    <div style="background: ${config.backgroundColor};">
      <h1>${config.headline}</h1>
      ${isPreview ? '<span class="preview-indicator">Preview</span>' : ''}
    </div>
  `
}
```

### HTML Best Practices for Email

When writing `renderHtml`:

1. **Use tables for layout**: Email clients have inconsistent CSS support
2. **Inline all styles**: External stylesheets are often stripped
3. **Avoid CSS shorthand**: Some clients don't support shorthand properties
4. **Use web-safe fonts**: Specify fallback fonts
5. **Set explicit widths**: Use pixel values, not percentages where possible
6. **Test across clients**: Gmail, Outlook, Apple Mail render differently

```typescript
// Good email HTML
renderHtml(config) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="margin: 0; font-size: 24px; line-height: 30px; color: #333333;">
            ${config.headline}
          </h1>
        </td>
      </tr>
    </table>
  `
}
```

## Creating Block Instances

Use `createCustomBlockInstance` to create instances of registered custom blocks:

```typescript
import { createCustomBlockInstance } from 'email-editor'

// Create with default config
const heroBlock = createCustomBlockInstance('hero')

// Create with overrides
const customHero = createCustomBlockInstance('hero', {
  headline: 'Summer Sale!',
  backgroundColor: '#fef3c7'
})
```

The function applies values in this order:

1. Schema field defaults
2. Definition's `defaultConfig`
3. Provided overrides

## Managing Custom Block Definitions

### Retrieve a Definition

```typescript
import { getCustomBlockDefinition } from 'email-editor'

const heroDef = getCustomBlockDefinition('hero')
if (heroDef) {
  console.log('Found:', heroDef.displayName)
}
```

### List All Definitions

```typescript
import { listCustomBlockDefinitions } from 'email-editor'

const allBlocks = listCustomBlockDefinitions()
console.log(`${allBlocks.length} custom blocks registered`)
```

### Subscribe to Changes

```typescript
import { subscribeCustomBlockDefinitions } from 'email-editor'

const unsubscribe = subscribeCustomBlockDefinitions((definitions) => {
  console.log('Custom blocks updated:', definitions.map(d => d.displayName))
})

// Later: clean up
unsubscribe()
```

## Custom Block State

Custom block instances include a `state` property tracking validity:

```typescript
interface CustomBlockState {
  isValid: boolean
  missingFields: string[]
  errors: ValidationError[]
}
```

The editor displays appropriate UI for invalid blocks:

- Missing definition: Shows a placeholder indicating the block type is unavailable
- Validation errors: Highlights invalid fields in the properties sidebar

## Complete Example: Product Card

```typescript
import { registerCustomBlock } from 'email-editor'

registerCustomBlock({
  id: 'product-card',
  displayName: 'Product Card',
  settingsSchema: {
    fields: [
      {
        key: 'productName',
        label: 'Product Name',
        type: 'string',
        required: true,
        max: 80
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: false,
        max: 200
      },
      {
        key: 'price',
        label: 'Price',
        type: 'string',
        required: true,
        helpText: 'Include currency symbol (e.g., $29.99)'
      },
      {
        key: 'imageUrl',
        label: 'Product Image',
        type: 'url',
        required: true
      },
      {
        key: 'ctaText',
        label: 'Button Text',
        type: 'string',
        default: 'Shop Now'
      },
      {
        key: 'ctaUrl',
        label: 'Button Link',
        type: 'url',
        required: true
      },
      {
        key: 'showBadge',
        label: 'Show Sale Badge',
        type: 'boolean',
        default: false
      },
      {
        key: 'badgeText',
        label: 'Badge Text',
        type: 'string',
        default: 'SALE'
      }
    ]
  },
  defaultConfig: {
    productName: 'Product Name',
    description: '',
    price: '$0.00',
    imageUrl: '',
    ctaText: 'Shop Now',
    ctaUrl: '',
    showBadge: false,
    badgeText: 'SALE'
  },
  validate(config) {
    const missingFields = []

    if (!config.productName) missingFields.push('productName')
    if (!config.price) missingFields.push('price')
    if (!config.imageUrl) missingFields.push('imageUrl')
    if (!config.ctaUrl) missingFields.push('ctaUrl')

    return {
      ok: missingFields.length === 0,
      missingFields
    }
  },
  renderHtml(config) {
    const badge = config.showBadge ? `
      <span style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: #e53e3e;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: bold;
      ">${config.badgeText}</span>
    ` : ''

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 300px; margin: 0 auto;">
        <tr>
          <td style="position: relative;">
            ${badge}
            <img
              src="${config.imageUrl}"
              alt="${config.productName}"
              width="300"
              style="display: block; width: 100%; height: auto;"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; text-align: center; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px; font-size: 18px; color: #1a202c;">
              ${config.productName}
            </h3>
            ${config.description ? `
              <p style="margin: 0 0 12px; font-size: 14px; color: #718096;">
                ${config.description}
              </p>
            ` : ''}
            <p style="margin: 0 0 16px; font-size: 20px; font-weight: bold; color: #2d3748;">
              ${config.price}
            </p>
            <a
              href="${config.ctaUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background: #3182ce;
                color: white;
                text-decoration: none;
                font-weight: bold;
                border-radius: 4px;
              "
            >${config.ctaText}</a>
          </td>
        </tr>
      </table>
    `
  }
})
```

## Tips and Best Practices

1. **Use unique IDs**: Block definition IDs must be unique across your application
2. **Provide sensible defaults**: Users should be able to add blocks without configuration
3. **Validate thoroughly**: Catch errors early with comprehensive validation
4. **Test HTML output**: Verify rendering in major email clients
5. **Keep schemas focused**: Each field should have a clear purpose
6. **Document your blocks**: Add `helpText` to fields that need explanation
7. **Handle missing data gracefully**: Your `renderHtml` should handle undefined/empty values
