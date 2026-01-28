import type { SettingsField, SettingsSchema, ValidationError, ValidationResult } from "./types";
import { isValidHexColor, isValidHttpUrl } from "./validation";

const STRING_TYPES: SettingsField["type"][] = ["string", "url", "html", "richtext", "color"];

const isMissingValue = (value: unknown, field: SettingsField): boolean => {
  if (!field.required) {
    return false;
  }

  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return false;
};

const validateType = (value: unknown, field: SettingsField): ValidationError | null => {
  switch (field.type) {
    case "string":
    case "html":
    case "richtext":
      return typeof value === "string"
        ? null
        : { field: field.key, message: "Expected a string value.", code: "type" };
    case "url":
      if (typeof value !== "string") {
        return { field: field.key, message: "Expected a URL string.", code: "type" };
      }
      return isValidHttpUrl(value)
        ? null
        : { field: field.key, message: "Invalid URL format.", code: "url" };
    case "color":
      if (typeof value !== "string") {
        return { field: field.key, message: "Expected a color string.", code: "type" };
      }
      return isValidHexColor(value)
        ? null
        : { field: field.key, message: "Invalid color format.", code: "color" };
    case "number":
      return typeof value === "number" && !Number.isNaN(value)
        ? null
        : { field: field.key, message: "Expected a number value.", code: "type" };
    case "boolean":
      return typeof value === "boolean"
        ? null
        : { field: field.key, message: "Expected a boolean value.", code: "type" };
    case "select": {
      if (typeof value !== "string" && typeof value !== "number") {
        return { field: field.key, message: "Expected a select value.", code: "type" };
      }
      if (!field.options || field.options.length === 0) {
        return { field: field.key, message: "Select options are missing.", code: "options" };
      }
      const valid = field.options.some((option) => option.value === value);
      return valid
        ? null
        : { field: field.key, message: "Value is not in allowed options.", code: "options" };
    }
    default:
      return { field: field.key, message: "Unknown field type.", code: "type" };
  }
};

const validateStringConstraints = (value: string, field: SettingsField): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof field.min === "number" && value.length < field.min) {
    errors.push({
      field: field.key,
      message: `Must be at least ${field.min} characters.`,
      code: "min"
    });
  }

  if (typeof field.max === "number" && value.length > field.max) {
    errors.push({
      field: field.key,
      message: `Must be at most ${field.max} characters.`,
      code: "max"
    });
  }

  if (field.pattern) {
    try {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.push({
          field: field.key,
          message: "Does not match required pattern.",
          code: "pattern"
        });
      }
    } catch {
      errors.push({
        field: field.key,
        message: "Invalid pattern provided in schema.",
        code: "pattern"
      });
    }
  }

  return errors;
};

const validateNumberConstraints = (value: number, field: SettingsField): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof field.min === "number" && value < field.min) {
    errors.push({
      field: field.key,
      message: `Must be at least ${field.min}.`,
      code: "min"
    });
  }

  if (typeof field.max === "number" && value > field.max) {
    errors.push({
      field: field.key,
      message: `Must be at most ${field.max}.`,
      code: "max"
    });
  }

  return errors;
};

export const validateSettingsSchema = (
  schema: SettingsSchema,
  config: Record<string, unknown>
): ValidationResult => {
  const missingFields: string[] = [];
  const errors: ValidationError[] = [];

  for (const field of schema.fields) {
    const value = config[field.key];
    if (isMissingValue(value, field)) {
      missingFields.push(field.key);
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    const typeError = validateType(value, field);
    if (typeError) {
      errors.push(typeError);
      continue;
    }

    if (typeof value === "string" && STRING_TYPES.includes(field.type)) {
      errors.push(...validateStringConstraints(value, field));
    }

    if (typeof value === "number" && field.type === "number") {
      errors.push(...validateNumberConstraints(value, field));
    }
  }

  return {
    ok: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors
  };
};
