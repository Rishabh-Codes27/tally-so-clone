import type { FormBlock } from "@/components/form-builder/types";

const fallbackLabels: Record<FormBlock["type"], string> = {
  text: "",
  title: "Title",
  label: "Label",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  paragraph: "Paragraph",
  "short-answer": "Question",
  "long-answer": "Question",
  email: "Email address",
  number: "Number",
  url: "URL",
  phone: "Phone number",
  date: "Date",
  time: "Time",
  "multiple-choice": "Question",
  checkboxes: "Question",
  dropdown: "Question",
  "multi-select": "Question",
  "linear-scale": "Question",
  matrix: "Question",
  rating: "Question",
  payment: "Payment",
  signature: "Signature",
  ranking: "Ranking",
  "wallet-connect": "Wallet Connect",
  "file-upload": "File upload",
  divider: "",
  image: "Image",
  video: "Video",
  audio: "Audio",
  embed: "Embed",
  "page-break": "",
  "new-page": "",
  "thank-you-page": "Thank you",
  "conditional-logic": "Conditional logic",
  "calculated-field": "Calculated field",
  "hidden-field": "Hidden field",
  recaptcha: "reCAPTCHA",
  "respondent-country": "Respondent's country",
};

function getLabel(block: FormBlock) {
  if (block.type === "image") {
    return fallbackLabels[block.type];
  }
  const content = block.content?.trim();
  return content || fallbackLabels[block.type];
}

export { fallbackLabels, getLabel };
