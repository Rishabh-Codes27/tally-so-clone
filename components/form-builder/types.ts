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
  | "new-page"

export interface FormBlock {
  id: string
  type: BlockType
  content: string
  options?: string[]
  required?: boolean
  placeholder?: string
  rows?: string[]
  columns?: string[]
  timeStart?: string
  timeEnd?: string
  timeStep?: number
}

export interface SlashCommandItem {
  type: BlockType
  label: string
  description: string
  icon: string
  category: string
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // Questions
  { type: "short-answer", label: "Short answer", description: "Single line text input", icon: "short-answer", category: "Questions" },
  { type: "long-answer", label: "Long answer", description: "Multi-line text area", icon: "long-answer", category: "Questions" },
  { type: "multiple-choice", label: "Multiple choice", description: "Single selection from options", icon: "multiple-choice", category: "Questions" },
  { type: "checkboxes", label: "Checkboxes", description: "Multiple selection from options", icon: "checkboxes", category: "Questions" },
  { type: "dropdown", label: "Dropdown", description: "Dropdown selection", icon: "dropdown", category: "Questions" },
  { type: "multi-select", label: "Multi-select", description: "Select multiple from dropdown", icon: "multi-select", category: "Questions" },
  { type: "number", label: "Number", description: "Numeric input field", icon: "number", category: "Questions" },
  { type: "email", label: "Email", description: "Email address field", icon: "email", category: "Questions" },
  { type: "phone", label: "Phone number", description: "Phone number field", icon: "phone", category: "Questions" },
  { type: "url", label: "Link", description: "Website link field", icon: "url", category: "Questions" },
  { type: "file-upload", label: "File upload", description: "File attachment field", icon: "file-upload", category: "Questions" },
  { type: "date", label: "Date", description: "Date picker field", icon: "date", category: "Questions" },
  { type: "time", label: "Time", description: "Time picker field", icon: "time", category: "Questions" },
  { type: "linear-scale", label: "Linear scale", description: "Scale from 1 to N", icon: "linear-scale", category: "Questions" },
  { type: "matrix", label: "Matrix", description: "Grid of rows and columns", icon: "matrix", category: "Questions" },
  { type: "rating", label: "Rating", description: "Star rating field", icon: "rating", category: "Questions" },
  { type: "payment", label: "Payment", description: "Payment collection field", icon: "payment", category: "Questions" },
  { type: "signature", label: "Signature", description: "Signature drawing field", icon: "signature", category: "Questions" },
  { type: "ranking", label: "Ranking", description: "Rank items in order", icon: "ranking", category: "Questions" },
  { type: "wallet-connect", label: "Wallet Connect", description: "Web3 wallet connection", icon: "wallet-connect", category: "Questions" },
  // Layout blocks
  { type: "new-page", label: "New page", description: "Start a new page", icon: "new-page", category: "Layout blocks" },
  { type: "divider", label: "Divider", description: "Horizontal separator line", icon: "divider", category: "Layout blocks" },
  { type: "heading1", label: "Heading 1", description: "Large section heading", icon: "heading1", category: "Layout blocks" },
  { type: "heading2", label: "Heading 2", description: "Medium section heading", icon: "heading2", category: "Layout blocks" },
  { type: "heading3", label: "Heading 3", description: "Small section heading", icon: "heading3", category: "Layout blocks" },
  { type: "paragraph", label: "Paragraph", description: "Plain text paragraph", icon: "paragraph", category: "Layout blocks" },
  { type: "image", label: "Image", description: "Upload or embed an image", icon: "image", category: "Layout blocks" },
  { type: "page-break", label: "Page break", description: "Break into multiple pages", icon: "page-break", category: "Layout blocks" },
]
