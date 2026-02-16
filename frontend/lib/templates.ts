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
    id: "reading-club",
    title: "Reading Club Signup",
    description: "Join our reading club community",
    icon: "📚",
    blocks: [
      {
        id: generateId(),
        type: "title",
        content: "Reading Club Sign Up",
      },
      {
        id: generateId(),
        type: "paragraph",
        content: "Join our community of book lovers and avid readers!",
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Your Name",
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
        type: "checkboxes",
        content: "Favorite Genres",
        options: [
          "Fiction",
          "Mystery",
          "Science Fiction",
          "Fantasy",
          "Biography",
          "Self-Help",
          "Romance",
        ],
        required: true,
      },
      {
        id: generateId(),
        type: "multiple-choice",
        content: "How often do you read?",
        options: [
          "Daily",
          "Several times a week",
          "Weekly",
          "A few times a month",
          "Monthly",
        ],
        required: true,
      },
      {
        id: generateId(),
        type: "short-answer",
        content: "Currently reading or favorite book",
        required: false,
      },
      {
        id: generateId(),
        type: "long-answer",
        content: "Tell us about your reading goals",
        required: false,
      },
      {
        id: generateId(),
        type: "thank-you-page",
        content:
          "Great! Welcome to our reading club. You will receive updates soon.",
      },
    ],
  },
];
