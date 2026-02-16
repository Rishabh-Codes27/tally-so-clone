import type { FormBlock } from "@/components/form-builder/types";

type AnswerMap = Record<string, unknown>;

type ValidationResult = {
  errors: Record<string, string>;
  isValid: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+0-9()\s-]{6,}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function matchesAllowedType(fileType: string, allowed: string[]) {
  if (allowed.length === 0) return true;
  return allowed.some((entry) => {
    const normalized = entry.trim();
    if (!normalized) return false;
    if (normalized.endsWith("/*")) {
      const prefix = normalized.slice(0, -1);
      return fileType.startsWith(prefix);
    }
    return fileType === normalized;
  });
}

function validateBlock(block: FormBlock, value: unknown): string | null {
  if (block.type === "payment" || block.type === "wallet-connect") {
    return null;
  }

  if (block.required && isEmpty(value)) {
    return "This field is required.";
  }

  if (isEmpty(value)) {
    return null;
  }

  switch (block.type) {
    case "short-answer":
    case "long-answer":
    case "text":
    case "paragraph":
    case "title":
    case "label":
    case "thank-you-page":
      return typeof value === "string" ? null : "Must be text.";
    case "email":
      return typeof value === "string" && EMAIL_PATTERN.test(value)
        ? null
        : "Enter a valid email.";
    case "number": {
      if (typeof value === "number") return null;
      if (typeof value === "string" && value.trim() !== "") {
        return Number.isFinite(Number(value)) ? null : "Enter a valid number.";
      }
      return "Enter a valid number.";
    }
    case "url":
      return typeof value === "string" && isValidUrl(value)
        ? null
        : "Enter a valid URL.";
    case "phone":
      return typeof value === "string" && PHONE_PATTERN.test(value)
        ? null
        : "Enter a valid phone number.";
    case "date":
      return typeof value === "string" && DATE_PATTERN.test(value)
        ? null
        : "Enter a valid date.";
    case "time":
      return typeof value === "string" && TIME_PATTERN.test(value)
        ? null
        : "Enter a valid time.";
    case "multiple-choice":
    case "dropdown":
      return typeof value === "string" && (block.options || []).includes(value)
        ? null
        : "Select a valid option.";
    case "checkboxes":
    case "multi-select": {
      if (!Array.isArray(value)) return "Select valid options.";
      const allowed = new Set(block.options || []);
      return value.every(
        (item) => typeof item === "string" && allowed.has(item),
      )
        ? null
        : "Select valid options.";
    }
    case "linear-scale": {
      const min = block.scaleMin ?? 1;
      const max = block.scaleMax ?? 5;
      const numeric = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(numeric)) return "Select a valid value.";
      return numeric >= min && numeric <= max ? null : "Select a valid value.";
    }
    case "rating": {
      const max = block.ratingMax ?? 5;
      const numeric = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(numeric)) return "Select a valid rating.";
      return numeric >= 1 && numeric <= max ? null : "Select a valid rating.";
    }
    case "matrix": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return "Complete the matrix.";
      }
      const rows = block.rows || [];
      const columns = new Set(block.columns || []);
      const record = value as Record<string, string>;
      for (const row of rows) {
        const selected = record[row];
        if (block.required && (!selected || !columns.has(selected))) {
          return "Complete the matrix.";
        }
        if (selected && !columns.has(selected)) {
          return "Select valid options.";
        }
      }
      return null;
    }
    case "ranking": {
      if (!Array.isArray(value)) return "Provide a ranking.";
      const options = block.options || [];
      const unique = new Set(value);
      if (unique.size !== value.length) return "Ranking must be unique.";
      return value.every((item) => options.includes(item))
        ? null
        : "Provide a valid ranking.";
    }
    case "file-upload": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return "Upload a valid file.";
      }
      const file = value as {
        name?: string;
        size?: number;
        type?: string;
        data?: string;
      };
      if (!file.name || !file.type || !file.data) {
        return "Upload a valid file.";
      }
      const maxBytes = (block.fileMaxSizeMb ?? 0.5) * 1024 * 1024;
      if (file.size && file.size > maxBytes) {
        return `File exceeds ${(block.fileMaxSizeMb ?? 0.5).toFixed(1)}MB limit.`;
      }
      const allowedTypes = block.fileAllowedTypes || [];
      if (!matchesAllowedType(file.type, allowedTypes)) {
        return "File type not allowed.";
      }
      return null;
    }
    case "signature":
      return typeof value === "string" && value.startsWith("data:image/")
        ? null
        : "Add a signature.";
    // case "payment": {
    //   if (typeof value !== "object" || value === null || Array.isArray(value)) {
    //     return "Payment is required.";
    //   }
    //   const payment = value as { status?: string; session_id?: string };
    //   return payment.status === "paid" || payment.status === "pending"
    //     ? null
    //     : "Payment is required.";
    // }
    // case "wallet-connect": {
    //   if (typeof value !== "object" || value === null || Array.isArray(value)) {
    //     return "Connect a wallet.";
    //   }
    //   const wallet = value as { address?: string };
    //   return wallet.address ? null : "Connect a wallet.";
    // }
    case "respondent-country":
      return typeof value === "string" ? null : "Country is required.";
    case "recaptcha":
      return value === "verified" ? null : "Verify reCAPTCHA.";
    case "hidden-field":
      return typeof value === "string" ? null : "Hidden field is invalid.";
    default:
      return null;
  }
}

export function validateAnswers(
  blocks: FormBlock[],
  answers: AnswerMap,
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const block of blocks) {
    const error = validateBlock(block, answers[block.id]);
    if (error) {
      errors[block.id] = error;
    }
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
