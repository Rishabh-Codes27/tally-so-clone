export interface Template {
  id: string;
  name: string;
  category:
    | "all"
    | "by-my-team"
    | "creators"
    | "product"
    | "marketing"
    | "hr"
    | "office"
    | "personal";
  creator: {
    name: string;
    avatar?: string;
  };
  likes: number;
  thumbnail?: string;
  description?: string;
}

export const TEMPLATES: Template[] = [
  // Creators
  {
    id: "web-project-intake",
    name: "Web Project Intake Questionnaire",
    category: "creators",
    creator: { name: "Andrea Grasso" },
    likes: 22456,
    description: "Collect project details and requirements from clients",
  },
  {
    id: "freelance-quote",
    name: "Freelance Quote Form Template",
    category: "creators",
    creator: { name: "Marie Martens from Tally" },
    likes: 12885,
    description: "Request and manage freelance quotes",
  },

  // Product
  {
    id: "customer-feedback",
    name: "Customer Feedback Form Template",
    category: "product",
    creator: { name: "Marie Martens from Tally" },
    likes: 29880,
    description: "Gather customer feedback and reviews",
  },
  {
    id: "revflow-waiting",
    name: "Revflow Waiting List",
    category: "product",
    creator: { name: "Marie Martens from Tally" },
    likes: 52416,
    description: "Manage product waiting lists",
  },
  {
    id: "feature-request",
    name: "Feature Request Form Template",
    category: "product",
    creator: { name: "Marie Martens from Tally" },
    likes: 4593,
    description: "Collect feature requests from users",
  },
  {
    id: "product-waiting-list",
    name: "Product waiting list [Pro]",
    category: "product",
    creator: { name: "Marie Martens from Tally" },
    likes: 2694,
    description: "Manage premium product waiting lists",
  },
  {
    id: "waiting-list-conditional",
    name: "Waiting List Form with Conditional Logic",
    category: "product",
    creator: { name: "Aaron Leggett" },
    likes: 8012,
    description: "Advanced waiting list with conditional logic",
  },

  // Marketing
  {
    id: "lead-generation",
    name: "Lead Generation Form Template",
    category: "marketing",
    creator: { name: "Marie Martens from Tally" },
    likes: 52416,
    description: "Generate and capture leads",
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction Survey Template",
    category: "marketing",
    creator: { name: "Marie Martens from Tally" },
    likes: 18212,
    description: "Measure customer satisfaction",
  },
  {
    id: "event-registration",
    name: "Event Registration Form Template",
    category: "marketing",
    creator: { name: "Marie Martens from Tally" },
    likes: 13625,
    description: "Register attendees for events",
  },
  {
    id: "enquiry-form",
    name: "Enquiry Form Template",
    category: "marketing",
    creator: { name: "Abi Connick" },
    likes: 12182,
    description: "Collect customer enquiries",
  },
  {
    id: "lead-magnet-quiz",
    name: "Lead Magnet Personality Quiz for Email Mar...",
    category: "marketing",
    creator: { name: "Cat and Mouse Studio" },
    likes: 8068,
    description: "Personality quiz for lead generation",
  },
  {
    id: "product-market-fit",
    name: "Product Market Fit Survey Template",
    category: "marketing",
    creator: { name: "Marie Martens from Tally" },
    likes: 7590,
    description: "Assess product market fit",
  },
  {
    id: "website-questionnaire",
    name: "Website Questionnaire",
    category: "marketing",
    creator: { name: "Dan Marek" },
    likes: 4573,
    description: "Collect website visitor feedback",
  },
  {
    id: "nps-survey",
    name: "Net Promoter Score (NPS) Survey Template",
    category: "marketing",
    creator: { name: "Marie Martens from Tally" },
    likes: 3485,
    description: "Measure Net Promoter Score",
  },

  // HR
  {
    id: "job-application",
    name: "Job Application Form Template",
    category: "hr",
    creator: { name: "Marie Martens from Tally" },
    likes: 14767,
    description: "Collect job applications",
  },
  {
    id: "hiring-form",
    name: "Hiring OS - hiring form",
    category: "hr",
    creator: { name: "Jonathan Sabbah" },
    likes: 6170,
    description: "Streamlined hiring process",
  },
  {
    id: "employee-engagement",
    name: "Employee Engagement Survey Template",
    category: "hr",
    creator: { name: "Marie Martens from Tally" },
    likes: 5170,
    description: "Measure employee engagement",
  },
  {
    id: "discord-application",
    name: "Discord Application form",
    category: "hr",
    creator: { name: "Fabian 9799" },
    likes: 3502,
    description: "Application form for Discord communities",
  },
  {
    id: "oaky-evaluation",
    name: "Oaky - Evaluation form",
    category: "hr",
    creator: { name: "Wouter Wisselink" },
    likes: 1947,
    description: "Employee evaluation form",
  },
  {
    id: "myers-briggs",
    name: "Myers–Briggs Type Test",
    category: "hr",
    creator: { name: "Victoriano Izquierdo" },
    likes: 1853,
    description: "Myers-Briggs personality assessment",
  },
  {
    id: "psychological-safety",
    name: "Psychological Safety Survey | UX Playbook",
    category: "hr",
    creator: { name: "Christopher Nguyen" },
    likes: 1672,
    description: "Assess psychological safety in teams",
  },
  {
    id: "exit-survey",
    name: "Exit Survey Form Template",
    category: "hr",
    creator: { name: "Marie Martens from Tally" },
    likes: 967,
    description: "Exit interview survey",
  },

  // Office
  {
    id: "team-activity-rsvp",
    name: "Team Activity RSVP Form Template",
    category: "office",
    creator: { name: "Marie Martens from Tally" },
    likes: 2031,
    description: "RSVP for team activities",
  },
  {
    id: "team-lunch-order",
    name: "Team Lunch Order Form Template",
    category: "office",
    creator: { name: "Marie Martens from Tally" },
    likes: 1941,
    description: "Collect lunch orders from team",
  },
  {
    id: "contact-form",
    name: "Contact Form Template",
    category: "office",
    creator: { name: "Marie Martens from Tally" },
    likes: 64797,
    description: "General contact form",
  },
  {
    id: "remote-work-request",
    name: "Remote Work Request Template",
    category: "office",
    creator: { name: "Amber Reynolds" },
    likes: 1778,
    description: "Request remote work approval",
  },
  {
    id: "support-ticket",
    name: "Notion: Support Ticket (Template)",
    category: "office",
    creator: { name: "Johann Kuhn" },
    likes: 1260,
    description: "Support ticket form",
  },
  {
    id: "secret-santa",
    name: "Secret Santa Template",
    category: "office",
    creator: { name: "Anete" },
    likes: 618,
    description: "Secret Santa gift exchange",
  },
  {
    id: "team-retreat",
    name: "Team Retreat Survey",
    category: "office",
    creator: { name: "Ahnaf Ahmed" },
    likes: 436,
    description: "Gather feedback on team retreats",
  },
  {
    id: "dsar-template",
    name: "DSAR Template",
    category: "office",
    creator: { name: "Rohit Das" },
    likes: 341,
    description: "Data Subject Access Request form",
  },

  // Personal
  {
    id: "online-trivia-quiz",
    name: "Online Trivia Quiz Template",
    category: "personal",
    creator: { name: "Marie Martens from Tally" },
    likes: 24448,
    description: "Create online trivia quizzes",
  },
  {
    id: "personality-quiz",
    name: "Personality Quiz Template",
    category: "personal",
    creator: { name: "Marie Martens from Tally" },
    likes: 17176,
    description: "Build personality quizzes",
  },
  {
    id: "fitness-form",
    name: "Fitness Form",
    category: "personal",
    creator: { name: "Cynthia Murithi" },
    likes: 13169,
    description: "Fitness tracking form",
  },
  {
    id: "party-rsvp",
    name: "Party RSVP Form Template",
    category: "personal",
    creator: { name: "Marie Martens from Tally" },
    likes: 4903,
    description: "RSVP for parties",
  },
  {
    id: "wedding-rsvp",
    name: "Wedding RSVP",
    category: "personal",
    creator: { name: "Sony Somar" },
    likes: 4544,
    description: "Wedding RSVP form",
  },
  {
    id: "wedding-invitation",
    name: "Invitation to our wedding",
    category: "personal",
    creator: { name: "Verónica Rey Souto" },
    likes: 1973,
    description: "Wedding invitation form",
  },
  {
    id: "wedding-address",
    name: "Wedding Address Collecting",
    category: "personal",
    creator: { name: "Maggie Tyson" },
    likes: 1832,
    description: "Collect wedding guest addresses",
  },
  {
    id: "superpower-quiz",
    name: "HYWM - Super Power Quiz",
    category: "personal",
    creator: { name: "David Odendahl" },
    likes: 1780,
    description: "Fun superpower discovery quiz",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "by-my-team", label: "By my team" },
  { id: "creators", label: "Creators" },
  { id: "product", label: "Product" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "HR" },
  { id: "office", label: "Office" },
  { id: "personal", label: "Personal" },
];
