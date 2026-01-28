import EmailEditor from "./vue/EmailEditor.vue";

export { EmailEditor };
export default EmailEditor;
export type {
  Document,
  Block,
  TextBlock,
  ButtonBlock,
  ImageBlock,
  HtmlBlock,
  CustomBlockDefinition,
  CustomBlockInstance,
  CustomBlockState,
  SettingsSchema,
  SettingsField,
  ValidationResult,
  ValidationError
} from "./core/types";
export type { ImageUploadHandler } from "./core/editor_api";
export { exportHtml } from "./services/html_export";
export { parseDocument } from "./services/json_import";
export { serializeDocument } from "./services/json_export";
export { validateDocument } from "./services/json_validation";
export { createCustomBlockInstance } from "./services/document_service";
export {
  registerCustomBlock,
  getCustomBlockDefinition,
  listCustomBlockDefinitions,
  subscribeCustomBlockDefinitions,
  DuplicateCustomBlockDefinitionError
} from "./core/custom_block_registry";
