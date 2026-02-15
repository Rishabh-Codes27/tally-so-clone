export type BlockType =
  | "text"
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
  | "page-break"
  | "new-page";

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
  // Choices
  {
    type: "multiple-choice",
    label: "Multiple choice",
    description: "Single select options",
    icon: "multiple-choice",
    category: "Choices",
  },
  {
    type: "checkboxes",
    label: "Checkboxes",
    description: "Multi select options",
    icon: "checkboxes",
    category: "Choices",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    description: "Select from a list",
    icon: "dropdown",
    category: "Choices",
  },
  {
    type: "multi-select",
    label: "Multi select",
    description: "Select multiple items",
    icon: "multi-select",
    category: "Choices",
  },
  // Layout
  {
    type: "heading1",
    label: "Heading 1",
    description: "Large heading",
    icon: "heading1",
    category: "Layout",
  },
  {
    type: "heading2",
    label: "Heading 2",
    description: "Medium heading",
    icon: "heading2",
    category: "Layout",
  },
  {
    type: "heading3",
    label: "Heading 3",
    description: "Small heading",
    icon: "heading3",
    category: "Layout",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Body text",
    icon: "paragraph",
    category: "Layout",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Separate sections",
    icon: "divider",
    category: "Layout",
  },
  {
    type: "page-break",
    label: "Page break",
    description: "Start a new page",
    icon: "page-break",
    category: "Layout",
  },
  {
    type: "new-page",
    label: "New page",
    description: "Add a page",
    icon: "new-page",
    category: "Layout",
  },
];
