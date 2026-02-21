import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";

const url = process.env.DATABASE_URL ?? "";
const needsSsl = url.includes("sslmode=");
const pool = new Pool({
  connectionString: url.replace(/[?&]sslmode=[^&]*/g, ""),
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Resume Profile
  const profileData = {
    name: "Carter Grove",
    title: "Senior Staff Engineer",
    email: "carter.grove@protonmail.com",
    phone: "(317) 935-6277",
    location: "Noblesville, IN",
    website: "https://cartergrove.me",
    github: "grovecj",
    linkedin: "cartergrove",
    summary:
      "Senior Staff Engineer with 10+ years of experience building backend systems, leading teams, and delivering high-impact products. Specialized in Java, TypeScript, microservices architecture, and distributed systems.",
  };
  await prisma.resumeProfile.upsert({
    where: { id: "profile-1" },
    update: profileData,
    create: { id: "profile-1", ...profileData },
  });

  // Skills
  const skills = [
    { id: "skill-1", category: "Languages", items: ["Java", "JavaScript/TypeScript", "SQL"], order: 0 },
    { id: "skill-2", category: "Frameworks & Libraries", items: ["Spring Boot", "React", "GraphQL", "gRPC", "Hibernate"], order: 1 },
    { id: "skill-3", category: "Infrastructure & Tools", items: ["PostgreSQL", "Kubernetes", "AWS (SQS, Lambda)", "Docker", "Git", "Maven"], order: 2 },
    { id: "skill-4", category: "Practices", items: ["Microservices architecture", "Distributed systems", "Database replication", "API design"], order: 3 },
  ];

  for (const skill of skills) {
    const data = { category: skill.category, items: JSON.stringify(skill.items), order: skill.order };
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: data,
      create: { id: skill.id, ...data },
    });
  }

  // Work Experience
  const experiences = [
    {
      id: "exp-1",
      company: "Fanatics Betting & Gaming",
      title: "Senior Staff Engineer",
      location: "Indianapolis, IN",
      start: "Sept 2022",
      end: "Present",
      bullets: [
        "Designed and built the backend content GraphQL service powering the discover, schedule, league, and single event pages for the sportsbook mobile app, enabling a successful closed beta launch six months after joining",
        "Reverse engineered and became the subject matter expert on the inherited bonus engine; integrated FanCash and built the initial version of Refer a Friend, the company's most important acquisition channel",
        "Integrated bonus functionality into the betslip, allowing users to opt in and apply offers in a unified experience with improved visibility",
        "Led an 18-month large-scale migration extracting the bonus engine from a monolith into six new microservices backed by a new PostgreSQL database, while continuously operating and enhancing the live system",
        "Served as IC leader for a team of 10 engineers at peak staffing\u2014unblocking contributors, reviewing code, creating test plans, and coordinating launches across the organization",
      ],
      order: 0,
    },
    {
      id: "exp-2",
      company: "DMI (KAR Global \u2013 Openlane)",
      title: "Technical Lead & Managing Consultant",
      location: "Indianapolis, IN",
      start: "Nov 2018",
      end: "Sept 2022",
      bullets: [
        "Launched Simulcast, a product allowing online users to participate and bid in physical auctions by integrating the on-site vehicle data system with a third-party auction platform; rolled out to 75+ auction sites",
        "Built Upstream Simulcast, an online-only auction experience requiring reverse engineering of the poorly documented Openlane system to source vehicle data without physical auction dependencies",
        "Led a team of four developers to create a new bidding API on AWS, enabling high-volume buyers to bid programmatically without the website UI",
        "Integrated Google Tag Manager, Five9 live chat, and accessiBe into the legacy ADESA marketplace",
        "Migrated AuctionACCESS integration from IBM Message Flow and MQ to AWS SQS and Lambda",
        "Acted as first-line manager for a team of six new college graduates, providing coaching, preparing performance reviews, and executing action plans",
      ],
      order: 1,
    },
    {
      id: "exp-3",
      company: "DMI (Allison Transmission)",
      title: "Software Engineer",
      location: "Indianapolis, IN",
      start: "Jan 2018",
      end: "Nov 2018",
      bullets: [
        "Built the admin portal and permissioning infrastructure for a centralized subscription platform that packaged Allison's suite of applications for sale",
        "Assumed tech lead responsibilities for back-end modules after the departure of the senior resource mid-project",
        "Tech stack: Spring Boot, Hibernate, Oracle, Maven (back end); React/Redux (front end)",
      ],
      order: 2,
    },
    {
      id: "exp-4",
      company: "Allegient, LLC",
      title: "Software Engineering Intern",
      location: "Indianapolis, IN",
      start: "June 2015",
      end: "Aug 2015",
      bullets: [
        "Implemented the front end of an internal talent-tracking application in AngularJS to help match consultants with pipeline projects based on skills",
        "Developed and formalized an agile process for internal projects",
      ],
      order: 3,
    },
    {
      id: "exp-5",
      company: "Rose-Hulman Institute of Technology",
      title: "Student Laptop Technician",
      location: "Terre Haute, IN",
      start: "June 2014",
      end: "May 2015",
      bullets: [
        "Prepared 600 laptops for the incoming freshman class, handling logistics, imaging, software installation, and welcome kit assembly",
        "Provided level 2 service desk support, troubleshooting software issues and performing warranty repairs",
      ],
      order: 4,
    },
  ];

  for (const exp of experiences) {
    const data = {
      company: exp.company,
      title: exp.title,
      location: exp.location,
      start: exp.start,
      end: exp.end,
      bullets: JSON.stringify(exp.bullets),
      order: exp.order,
    };
    await prisma.workExperience.upsert({
      where: { id: exp.id },
      update: data,
      create: { id: exp.id, ...data },
    });
  }

  // Education
  const eduData = {
    school: "Western Governor's University",
    degree: "Bachelor of Science",
    field: "Software Development",
    start: "2016",
    end: "Fall 2017",
    gpa: null,
    bullets: null,
    order: 0,
  };
  await prisma.education.upsert({
    where: { id: "edu-1" },
    update: eduData,
    create: { id: "edu-1", ...eduData },
  });

  // Portfolio Projects
  await prisma.portfolioProject.upsert({
    where: { id: "proj-1" },
    update: {},
    create: {
      id: "proj-1",
      slug: "gif-clipper",
      title: "Gif Clipper",
      subdomain: "gif",
      tagline: "Cross-platform screen capture to GIF",
      description:
        "A desktop application that lets you capture any region of your screen and instantly convert it to an optimized GIF. Built with Electron for cross-platform support, React for the UI, and a Spring Boot backend for processing and storage.",
      techStack: JSON.stringify(["Electron", "TypeScript", "React", "Spring Boot", "Kotlin", "FFmpeg"]),
      features: JSON.stringify([
        "Region selection with resizable overlay",
        "Real-time preview before capture",
        "Automatic GIF optimization and compression",
        "Cloud upload and shareable links",
        "Cross-platform: Windows, macOS, Linux",
      ]),
      heroImage: null,
      githubUrl: "https://github.com/grovecj/gif-clipper",
      liveUrl: "https://gif.cartergrove.me",
      order: 0,
    },
  });

  await prisma.portfolioProject.upsert({
    where: { id: "proj-2" },
    update: {},
    create: {
      id: "proj-2",
      slug: "mlb-stats",
      title: "MLB Stats",
      subdomain: "stats",
      tagline: "Full-stack MLB statistics dashboard",
      description:
        "A comprehensive baseball statistics application with real-time data, historical comparisons, and interactive visualizations. React 18 frontend with TypeScript and Vite, backed by a Java 21 + Spring Boot 3.x API.",
      techStack: JSON.stringify(["React 18", "TypeScript", "Vite", "Java 21", "Spring Boot 3", "PostgreSQL"]),
      features: JSON.stringify([
        "Real-time game scores and player stats",
        "Historical stat comparisons across eras",
        "Interactive charts and data visualizations",
        "Advanced search and filtering",
        "Responsive design for mobile and desktop",
      ]),
      heroImage: null,
      githubUrl: "https://github.com/grovecj/mlb-stats",
      liveUrl: "https://stats.cartergrove.me",
      order: 1,
    },
  });

  // Sample Blog Post
  await prisma.blogPost.upsert({
    where: { id: "post-1" },
    update: {},
    create: {
      id: "post-1",
      slug: "building-my-personal-site",
      title: "Building My Personal Site with Next.js 15",
      excerpt:
        "How I built cartergrove.me with Next.js 15, Tailwind CSS, and a custom admin CMS.",
      content: `# Building My Personal Site with Next.js 15

I recently rebuilt my personal website from scratch using Next.js 15 with the App Router, Tailwind CSS, and a custom admin CMS. Here's what I learned along the way.

## Tech Stack

- **Next.js 15** with App Router for server components and API routes
- **Tailwind CSS v4** + **shadcn/ui** for styling
- **PostgreSQL** via Prisma for the database
- **NextAuth.js v5** with GitHub OAuth for admin authentication
- **framer-motion** for portfolio animations

## The Portfolio Page

The signature feature is the portfolio page with full-page snap scrolling. Each project gets its own viewport-height slide with an animated subdomain header that transitions as you scroll between projects.

\`\`\`tsx
<div className="snap-y snap-mandatory overflow-y-auto">
  {projects.map((project) => (
    <div key={project.id} className="snap-start h-full">
      <ProjectSlide {...project} />
    </div>
  ))}
</div>
\`\`\`

## What's Next

I'm planning to add more projects and blog posts as I continue building. Stay tuned!
`,
      tags: JSON.stringify(["nextjs", "react", "webdev"]),
      published: true,
    },
  });

  // Under Construction Banner
  await prisma.banner.upsert({
    where: { id: "banner-1" },
    update: {},
    create: {
      id: "banner-1",
      message: "This site is under construction. Some content may be incomplete.",
      variant: "warning",
      active: true,
      order: 0,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
