export type BlockType =
  | "text"
  | "title"
  | "label"
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "short-answer"
  | "long-answer"
  | "email"
  | "number"
  | "url"
  | "phone"
  | "date"
  | "time"
  | "multiple-choice"
  | "checkboxes"
  | "dropdown"
  | "multi-select"
  | "linear-scale"
  | "matrix"
  | "rating"
  | "payment"
  | "signature"
  | "ranking"
  | "wallet-connect"
  | "file-upload"
  | "divider"
  | "image"
  | "video"
  | "audio"
  | "embed"
  | "page-break"
  | "new-page"
  | "thank-you-page"
  | "conditional-logic"
  | "calculated-field"
  | "hidden-field"
  | "recaptcha"
  | "respondent-country";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal"
  | "is_empty"
  | "is_not_empty"
  | "starts_with"
  | "ends_with";

export type ConditionalAction = "show" | "hide" | "require" | "optional";

export interface ConditionalRule {
  id: string;
  fieldId: string;
  operator: ConditionOperator;
  value: string;
  action: ConditionalAction;
  targetBlockId?: string;
}

export interface FormBlock {
  id: string;
  type: BlockType;
  content: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  rows?: string[];
  columns?: string[];
  timeStart?: string;
  timeEnd?: string;
  timeStep?: number;
  scaleMin?: number;
  scaleMax?: number;
  ratingMax?: number;
  fileMaxSizeMb?: number;
  fileAllowedTypes?: string[];
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentDescription?: string;
  conditionalRules?: ConditionalRule[];
}

export interface SlashCommandItem {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  category: string;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // Questions
  {
    type: "short-answer",
    label: "Short answer",
    description: "Single line text input",
    icon: "short-answer",
    category: "Questions",
  },
  {
    type: "long-answer",
    label: "Long answer",
    description: "Multi-line text area",
    icon: "long-answer",
    category: "Questions",
  },
  {
    type: "multiple-choice",
    label: "Multiple choice",
    description: "Single select options",
    icon: "multiple-choice",
    category: "Questions",
  },
  {
    type: "checkboxes",
    label: "Checkboxes",
    description: "Multi select options",
    icon: "checkboxes",
    category: "Questions",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    description: "Select from a list",
    icon: "dropdown",
    category: "Questions",
  },
  {
    type: "multi-select",
    label: "Multi-select",
    description: "Select multiple items",
    icon: "multi-select",
    category: "Questions",
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input field",
    icon: "number",
    category: "Questions",
  },
  {
    type: "email",
    label: "Email",
    description: "Email address field",
    icon: "email",
    category: "Questions",
  },
  {
    type: "phone",
    label: "Phone number",
    description: "Phone number field",
    icon: "phone",
    category: "Questions",
  },
  {
    type: "url",
    label: "Link",
    description: "Website link field",
    icon: "url",
    category: "Questions",
  },
  {
    type: "file-upload",
    label: "File upload",
    description: "Upload a file",
    icon: "file-upload",
    category: "Questions",
  },
  {
    type: "date",
    label: "Date",
    description: "Date picker field",
    icon: "date",
    category: "Questions",
  },
  {
    type: "time",
    label: "Time",
    description: "Time picker field",
    icon: "time",
    category: "Questions",
  },
  {
    type: "linear-scale",
    label: "Linear scale",
    description: "Scale from min to max",
    icon: "linear-scale",
    category: "Questions",
  },
  {
    type: "matrix",
    label: "Matrix",
    description: "Grid of single choices",
    icon: "matrix",
    category: "Questions",
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star rating",
    icon: "rating",
    category: "Questions",
  },
  {
    type: "payment",
    label: "Payment",
    description: "Collect payments",
    icon: "payment",
    category: "Questions",
  },
  {
    type: "signature",
    label: "Signature",
    description: "Collect a signature",
    icon: "signature",
    category: "Questions",
  },
  {
    type: "ranking",
    label: "Ranking",
    description: "Rank a list",
    icon: "ranking",
    category: "Questions",
  },
  {
    type: "wallet-connect",
    label: "Wallet Connect",
    description: "Connect crypto wallet",
    icon: "wallet-connect",
    category: "Questions",
  },
  // Layout blocks
  {
    type: "heading1",
    label: "Heading 1",
    description: "Large heading",
    icon: "heading1",
    category: "Layout blocks",
  },
  {
    type: "heading2",
    label: "Heading 2",
    description: "Medium heading",
    icon: "heading2",
    category: "Layout blocks",
  },
  {
    type: "heading3",
    label: "Heading 3",
    description: "Small heading",
    icon: "heading3",
    category: "Layout blocks",
  },
  {
    type: "title",
    label: "Title",
    description: "Title text",
    icon: "title",
    category: "Layout blocks",
  },
  {
    type: "text",
    label: "Text",
    description: "Body text",
    icon: "text",
    category: "Layout blocks",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Body text",
    icon: "paragraph",
    category: "Layout blocks",
  },
  {
    type: "label",
    label: "Label",
    description: "Small helper text",
    icon: "label",
    category: "Layout blocks",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Separate sections",
    icon: "divider",
    category: "Layout blocks",
  },
  {
    type: "page-break",
    label: "Page break",
    description: "Start a new page",
    icon: "page-break",
    category: "Layout blocks",
  },
  {
    type: "new-page",
    label: "New page",
    description: "Add a page",
    icon: "new-page",
    category: "Layout blocks",
  },
  {
    type: "thank-you-page",
    label: "Thank you page",
    description: "End screen after submit",
    icon: "thank-you-page",
    category: "Layout blocks",
  },
  // Embed blocks
  {
    type: "image",
    label: "Image",
    description: "Embed an image",
    icon: "image",
    category: "Embed blocks",
  },
  {
    type: "video",
    label: "Video",
    description: "Embed a video",
    icon: "video",
    category: "Embed blocks",
  },
  {
    type: "audio",
    label: "Audio",
    description: "Embed audio",
    icon: "audio",
    category: "Embed blocks",
  },
  {
    type: "embed",
    label: "Embed anything",
    description: "Embed external content",
    icon: "embed",
    category: "Embed blocks",
  },
  // Advanced blocks
  {
    type: "conditional-logic",
    label: "Conditional logic",
    description: "Show/hide blocks",
    icon: "conditional-logic",
    category: "Advanced blocks",
  },
  {
    type: "calculated-field",
    label: "Calculated fields",
    description: "Compute values",
    icon: "calculated-field",
    category: "Advanced blocks",
  },
  {
    type: "hidden-field",
    label: "Hidden fields",
    description: "Collect hidden data",
    icon: "hidden-field",
    category: "Advanced blocks",
  },
  {
    type: "recaptcha",
    label: "reCAPTCHA",
    description: "Bot protection",
    icon: "recaptcha",
    category: "Advanced blocks",
  },
  {
    type: "respondent-country",
    label: "Respondent's country",
    description: "Auto-detect country",
    icon: "respondent-country",
    category: "Advanced blocks",
  },
];
