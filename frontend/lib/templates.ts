import type { FormBlock } from "@/components/form-builder/types";

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  blocks: FormBlock[];
}

const generateId = () => Math.random().toString(36).slice(2, 9);

export const TEMPLATES: Template[] = [
  {
    id: "hackathon",
    title: "Hackathon Registration",
    description: "Sign up participants for your hackathon event",
    icon: "🚀",
    blocks: [
      {
        id: generateId(),
        type: "title",
        content: "Hackathon Registration",
      },
      {
        id: generateId(),
        type: "paragraph",
        content: "Join us for an amazing hackathon experience!",
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Full Name",
        required: true,
      },
      {
        id: generateId(),
        type: "email",
        content: "Email Address",
        required: true,
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Team Name",
        required: true,
      },
      {
        id: generateId(),
        type: "multiple-choice",
        content: "Experience Level",
        options: ["Beginner", "Intermediate", "Advanced"],
        required: true,
      },
      {
        id: generateId(),
        type: "long-answer",
        content: "Project Idea (Brief Description)",
        required: true,
      },
      {
        id: generateId(),
        type: "phone",
        content: "Contact Phone Number",
        required: false,
      },
      {
        id: generateId(),
        type: "thank-you-page",
        content: "Thanks for registering! We look forward to seeing you.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Company Onboarding",
    description: "Employee information and onboarding form",
    icon: "🏢",
    blocks: [
      {
        id: generateId(),
        type: "title",
        content: "Employee Onboarding",
      },
      {
        id: generateId(),
        type: "paragraph",
        content:
          "Welcome to the team! Please fill out this form to complete your onboarding.",
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Full Name",
        required: true,
      },
      {
        id: generateId(),
        type: "email",
        content: "Work Email",
        required: true,
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Department",
        required: true,
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Job Title",
        required: true,
      },
      {
        id: generateId(),
        type: "date",
        content: "Start Date",
        required: true,
      },
      {
        id: generateId(),
        type: "phone",
        content: "Phone Number",
        required: true,
      },
      {
        id: generateId(),
        type: "long-answer",
        content: "Emergency Contact Information",
        required: true,
      },
      {
        id: generateId(),
        type: "checkboxes",
        content: "I have received and reviewed:",
        options: [
          "Employee handbook",
          "IT policies",
          "Benefits information",
          "Company culture guidelines",
        ],
        required: true,
      },
      {
        id: generateId(),
        type: "thank-you-page",
        content: "Welcome aboard! Your onboarding is complete.",
      },
    ],
  },
  {
    id: "test-all-components",
    title: "Test All Components",
    description: "Comprehensive form with all working field types for testing",
    icon: "🧪",
    blocks: [
      {
        id: generateId(),
        type: "title",
        content: "Complete Component Test Form",
      },
      {
        id: generateId(),
        type: "paragraph",
        content:
          "Test all form components and their validation. Fill out the form completely to verify functionality.",
      },
      {
        id: generateId(),
        type: "heading1",
        content: "🔤 Text Input Fields",
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Short Answer (Text)",
        required: true,
      },
      {
        id: generateId(),
        type: "long-answer",
        content: "Long Answer (Paragraph)",
        required: true,
      },
      {
        id: generateId(),
        type: "email",
        content: "Email Address",
        required: true,
      },
      {
        id: generateId(),
        type: "number",
        content: "Number Input",
        required: true,
      },
      {
        id: generateId(),
        type: "phone",
        content: "Phone Number",
        required: true,
      },
      {
        id: generateId(),
        type: "url",
        content: "Website URL",
        required: false,
      },
      {
        id: generateId(),
        type: "date",
        content: "Date Picker",
        required: true,
      },
      {
        id: generateId(),
        type: "time",
        content: "Time Picker",
        required: true,
      },
      {
        id: generateId(),
        type: "heading1",
        content: "✓ Choice Fields",
      },
      {
        id: generateId(),
        type: "multiple-choice",
        content: "Multiple Choice (Radio)",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        required: true,
      },
      {
        id: generateId(),
        type: "checkboxes",
        content: "Checkboxes (Multi-select)",
        options: ["Choice A", "Choice B", "Choice C", "Choice D"],
        required: true,
      },
      {
        id: generateId(),
        type: "dropdown",
        content: "Dropdown Menu",
        options: ["First", "Second", "Third", "Fourth"],
        required: true,
      },
      {
        id: generateId(),
        type: "heading1",
        content: "📊 Scales & Matrix",
      },
      {
        id: generateId(),
        type: "linear-scale",
        content: "Linear Scale (1-5)",
        scaleMin: 1,
        scaleMax: 5,
        required: true,
      },
      {
        id: generateId(),
        type: "rating",
        content: "Rating (1-10)",
        ratingMax: 10,
        required: true,
      },
      {
        id: generateId(),
        type: "matrix",
        content: "Matrix Question",
        rows: ["Row 1", "Row 2", "Row 3"],
        columns: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
        required: true,
      },
      {
        id: generateId(),
        type: "ranking",
        content: "Ranking (Drag to reorder)",
        options: [
          "First Priority",
          "Second Priority",
          "Third Priority",
          "Fourth Priority",
        ],
        required: true,
      },
      {
        id: generateId(),
        type: "heading1",
        content: "📁 Files & Signature",
      },
      {
        id: generateId(),
        type: "file-upload",
        content: "File Upload (Max 0.5MB)",
        fileMaxSizeMb: 0.5,
        required: true,
      },
      {
        id: generateId(),
        type: "signature",
        content: "Signature (Draw or sign)",
        required: true,
      },
      {
        id: generateId(),
        type: "heading1",
        content: "🌍 Smart Fields",
      },
      {
        id: generateId(),
        type: "respondent-country",
        content: "Your Country (Auto-filled)",
        required: true,
      },
      {
        id: generateId(),
        type: "recaptcha",
        content: "Verify you are human",
        required: true,
      },
      {
        id: generateId(),
        type: "hidden-field",
        content: "test-hidden-value",
      },
      {
        id: generateId(),
        type: "heading1",
        content: "🎨 Display & Layout",
      },
      {
        id: generateId(),
        type: "text",
        content: "This is a text block for informational content.",
      },
      {
        id: generateId(),
        type: "label",
        content: "This is a label/note section.",
      },
      {
        id: generateId(),
        type: "heading2",
        content: "Section Heading (H2)",
      },
      {
        id: generateId(),
        type: "heading3",
        content: "Subsection Heading (H3)",
      },
      {
        id: generateId(),
        type: "divider",
        content: "",
      },
      {
        id: generateId(),
        type: "image",
        content: "https://via.placeholder.com/600x300?text=Test+Image",
      },
      {
        id: generateId(),
        type: "video",
        content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: generateId(),
        type: "audio",
        content:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: generateId(),
        type: "embed",
        content: "<iframe src='https://www.w3schools.com'></iframe>",
      },
      {
        id: generateId(),
        type: "thank-you-page",
        content: "✅ Form submission successful! You've tested all components.",
      },
    ],
  },
];
