// ============================================================
// ALL SITE CONTENT LIVES HERE.
// Add a service/project/section by adding an object below.
// ============================================================

export const PROFILE = {
  name: "Debasish Das",
  role: "AI Application Engineer",
  location: "Kolkata, India",
  tagline1: "Businesses that",
  tagline2: "run themselves.",
  intro:
    "I build AI automation and full-stack software that runs your business — customer replies, bookings, lead capture, dashboards, and custom apps. Frontend to backend, I ship the whole thing.",
  email: "dasdeveloperdebasish@gmail.com",
  phone: "+917044200115",
  github: "https://github.com/dasdeveloperdebasish",
  linkedin: "https://linkedin.com/in/debasish-das-9ba645239",
  photo: "/debasish.jpeg",
  accent: "#00E599",
};

export const STATS = [
  { value: "5+", label: "Years exp" },
  { value: "10+", label: "Apps shipped" },
  { value: "24/7", label: "AI uptime", highlight: true },
  { value: "6", label: "Industries" },
];

export const SERVICES = [
  {
    icon: "message-2",
    title: "Stop losing night customers",
    desc: "AI answers on WhatsApp and your site 24/7 — even at 2am. Never miss a lead.",
  },
  {
    icon: "calendar-check",
    title: "Bookings on autopilot",
    desc: "Customers book by chat. It confirms, saves, and reminds them — fewer no-shows.",
  },
  {
    icon: "target-arrow",
    title: "Every lead, captured",
    desc: "Chats turn into saved leads, sent straight to you to follow up fast.",
  },
  {
    icon: "robot",
    title: "Custom AI agents",
    desc: "AI that does real work — reads documents, answers from your data, handles tasks end to end.",
  },
  {
    icon: "database",
    title: "Backend & APIs",
    desc: "Scalable Node.js and Express backends, databases, and integrations that power your product.",
  },
  {
    icon: "layout-dashboard",
    title: "Admin dashboards",
    desc: "Custom dashboards to see your bookings, leads, and data in one place — on any device.",
  },
  {
    icon: "device-mobile",
    title: "Mobile apps that ship",
    desc: "One codebase, iOS and Android. Production quality across many industries.",
  },
  {
    icon: "world",
    title: "Web apps built to scale",
    desc: "Fast, responsive web apps with Next.js and React — from landing pages to platforms.",
  },
  {
    icon: "bolt",
    title: "Workflow automation",
    desc: "If a task is slow, manual, or repetitive, I build something that does it for you.",
  },
];

// Proof section hidden for now. Fill this object to bring it back.
export const FEATURED: null | {
  tag: string;
  title: string;
  desc: string;
  demoUrl: string;
  demoLabel: string;
  previewName: string;
  previewQuestion: string;
  previewAnswer: string;
} = null;

export const PROJECTS = [
  {
    kind: "Mobile App · iOS & Android",
    title: "Real Estate Platform",
    desc: "React Native platform connecting buyers, sellers and agents. Advanced search, agent profiles, optimised UI.",
    pills: ["Load time -28%", "Deploy -40%"],
    tags: ["React Native", "Expo", "GraphQL"],
    year: "2024 – now",
    domain: "Real Estate",
  },
  {
    kind: "Mobile App · Real-Time",
    title: "Logistics & Live Tracking App",
    desc: "Live driver tracking on Google Maps, real-time trip status via Socket.IO, push notifications and ETAs.",
    pills: ["Live tracking", "Socket.IO"],
    tags: ["React Native", "Socket.IO", "Maps"],
    year: "2023 – 24",
    domain: "Logistics",
  },
  {
    kind: "Mobile App · Government Scale",
    title: "Government Citizen Services App",
    desc: "National-scale app: scheme enrolment, Aadhaar eKYC, Firestore chat, digital CV with QR, multi-lingual UI.",
    pills: ["National scale", "eKYC"],
    tags: ["React Native", "Firebase", "Node.js"],
    year: "2022 – 23",
    domain: "Government",
  },
];

export const STACK = [
  {
    group: "AI & Automation",
    items: ["Claude API", "OpenAI API", "Groq", "MCP", "Cursor AI"],
  },
  {
    group: "Backend & APIs",
    items: [
      "Node.js",
      "Express.js",
      "REST",
      "GraphQL",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  { group: "Mobile", items: ["React Native", "Expo", "iOS", "Android"] },
  { group: "Web", items: ["Next.js", "React.js", "TypeScript"] },
  {
    group: "Real-Time & Cloud",
    items: ["Socket.IO", "Firebase", "Cloudflare"],
  },
];
