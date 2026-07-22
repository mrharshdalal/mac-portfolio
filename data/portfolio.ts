import type {
  Education,
  Experience,
  NoteItem,
  Project,
  TrashItem,
} from "@/types";

export const portfolio = {
  name: "Harsh Dalal",
  title: "Full Stack Developer",
  tagline: "welcome to my",
  taglineAccent: "portfolio.",
  email: "mrharshdalal@gmail.com",
  phone: "+91 98962 67961",
  website: "github.com/mrharshdalal",
  location: "Bengaluru, India",
  bio: "I'm Harsh — a Full Stack Developer with 2 years of experience building scalable, production-ready web apps. I solve complex engineering problems across e-commerce and POS platforms, with a focus on clean architecture, performance, and cost-efficient systems. Skilled in Java, Spring Boot, TypeScript, and SvelteKit.",
  shortBio:
    "Full Stack Developer · Java · TypeScript · Spring Boot · SvelteKit. Shipping scalable products from Bengaluru.",
  socials: {
    linkedin: "https://linkedin.com/in/mrharshdalal",
    github: "https://github.com/mrharshdalal",
    email: "mailto:mrharshdalal@gmail.com",
  },
  resumeUrl: "/HarshDalalResume.pdf",
};

export const projects: Project[] = [
  {
    id: "boltbill",
    title: "BoltBill",
    subtitle: "Project 01",
    description:
      "API-first service that generates custom-branded PDF invoices as array buffers for seamless integration into business workflows. Dashboard with template selection and branding tools for automated, consistent invoice generation.",
    tags: ["TypeScript", "SvelteKit", "Firebase", "Firestore"],
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    year: "2025",
    role: "Full Stack Developer",
    link: "https://github.com/mrharshdalal",
  },
  {
    id: "quickneons",
    title: "Quick Neons",
    subtitle: "Project 02",
    description:
      "Custom product ordering interface for personalized neon signs with dynamic checkout and responsive design. Built for seamless customization and higher conversion rates.",
    tags: ["TypeScript", "SvelteKit", "Firebase", "Checkout"],
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
    year: "2025",
    role: "Full Stack Developer",
    link: "https://github.com/mrharshdalal",
  },
  {
    id: "pos-backend",
    title: "POS Backend",
    subtitle: "Project 03",
    description:
      "Scalable POS backend enabling real-time billing, inventory sync, and financial reporting. Improved checkout speed by 30% and cut manual reconciliation by 50% at Tech Inject.",
    tags: ["Java", "Spring Boot", "Redis", "APIs"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    year: "2024",
    role: "Full Stack Developer",
  },
  {
    id: "checkout-flow",
    title: "Modular Checkout",
    subtitle: "Project 04",
    description:
      "Reusable checkout flow supporting discounts, reward points, and Razorpay payments — improving conversion and reducing duplicate engineering across product lines.",
    tags: ["Spring Boot", "Razorpay", "E-commerce"],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae9b50245?w=800&q=80",
    year: "2024",
    role: "Full Stack Developer",
  },
];

export const experiences: Experience[] = [
  {
    company: "Tech Inject LLP",
    role: "Full Stack Developer",
    period: "Jan 2024 — Present",
    description:
      "Scaled an IP-based redirection service to 10k+ daily requests with Redis TTL caching. Built LRU product caching (70%+ fewer queries, 40% faster responses). Cut Firestore reads 40×, shipped POS backend, modular Razorpay checkout, and a 99% success notification service across email & WhatsApp.",
  },
  {
    company: "Goldlane",
    role: "Full Stack Developer Intern",
    period: "Jun 2023 — Nov 2023",
    description:
      "Built a demo booking site that grew bookings from zero to 3–5 daily. Led front-end for SIP Admin Webstore serving 20,000+ users — file uploads, API integrations, and smoother data handling.",
  },
];

export const education: Education[] = [
  {
    institution: "Lovely Professional University, Punjab",
    degree: "B.Tech — Computer Science",
    period: "Aug 2019 — May 2023",
  },
];

export const skills = [
  "Java",
  "TypeScript",
  "JavaScript",
  "Spring Boot",
  "SvelteKit",
  "Node.js",
  "Firebase Functions",
  "MySQL",
  "Firestore",
  "NoSQL",
  "Redis",
  "REST APIs",
  "Razorpay",
  "GCP",
  "Git",
  "Vercel",
];

export const notes: NoteItem[] = [
  {
    id: "todo",
    title: "To do:",
    content: [
      "~~Ship a macOS-style portfolio~~",
      "Keep BoltBill invoice API humming",
      "Ship Quick Neons checkout polish",
      "Learn one new system design pattern a week",
      "Finally organize Downloads folder",
      "Drink more water (seriously)",
    ].join("\n"),
    date: "2026-07-22",
    color: "#fef08a",
  },
  {
    id: "ideas",
    title: "Project Ideas",
    content:
      "- Invoice API marketplace\n- Neon sign configurator v2\n- Personal finance dashboard\n- Desktop OS portfolio (shipping…)",
    date: "2026-04-15",
  },
  {
    id: "stack",
    title: "Current Stack",
    content:
      "Daily drivers:\n- Java / Spring Boot\n- TypeScript / SvelteKit\n- Firebase + Firestore\n- Redis caching\n- Cursor + VS Code",
    date: "2026-05-02",
  },
  {
    id: "reading",
    title: "Reading / Learning",
    content:
      "- Designing Data-Intensive Applications\n- System Design Interview\n- Effective Java\n- Cloudflare / edge patterns",
    date: "2026-06-10",
  },
];

export const trashItems: TrashItem[] = [
  {
    id: "legacy-cache",
    name: "naive_cache_v1.java",
    type: "txt",
    subtitle: "Before Redis TTL. Never again.",
  },
  {
    id: "firestore-bill",
    name: "firestore_bill_shock.pdf",
    type: "pdf",
    subtitle: "The 40× reads era.",
  },
  {
    id: "wip",
    name: "half_baked_feature.branch",
    type: "txt",
    subtitle: "Abandoned on a Friday.",
  },
  {
    id: "old-portfolio",
    name: "portfolio_v0.html",
    type: "link",
    subtitle: "The old me.",
  },
];

export const timeline = [
  { year: "2025", event: "Shipping BoltBill & Quick Neons" },
  { year: "2024", event: "Full Stack @ Tech Inject · POS & checkout systems" },
  { year: "2023", event: "Intern @ Goldlane · Graduated B.Tech CSE" },
  { year: "2019", event: "Started Computer Science at LPU" },
];

export const stickyTodo = notes[0];
