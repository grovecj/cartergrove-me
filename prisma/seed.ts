import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Resume Profile
  await prisma.resumeProfile.upsert({
    where: { id: "profile-1" },
    update: {},
    create: {
      id: "profile-1",
      name: "Carter Grove",
      title: "Software Engineer",
      email: "carter@cartergrove.me",
      phone: "(555) 123-4567",
      location: "United States",
      website: "https://cartergrove.me",
      github: "grovecj",
      linkedin: "cartergrove",
      summary:
        "Full-stack software engineer with experience building web applications using TypeScript, React, Spring Boot, and cloud infrastructure. Passionate about clean code, developer experience, and shipping reliable software.",
    },
  });

  // Skills
  const skills = [
    { id: "skill-1", category: "Languages", items: ["TypeScript", "JavaScript", "Java", "Kotlin", "Python", "SQL"], order: 0 },
    { id: "skill-2", category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "HTML/CSS", "Vite"], order: 1 },
    { id: "skill-3", category: "Backend", items: ["Spring Boot", "Node.js", "REST APIs", "PostgreSQL", "Prisma"], order: 2 },
    { id: "skill-4", category: "DevOps & Tools", items: ["Docker", "GitHub Actions", "Terraform", "nginx", "Linux", "Git"], order: 3 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: { ...skill, items: JSON.stringify(skill.items) },
    });
  }

  // Work Experience
  await prisma.workExperience.upsert({
    where: { id: "exp-1" },
    update: {},
    create: {
      id: "exp-1",
      company: "Acme Corp",
      title: "Software Engineer",
      location: "Remote",
      start: "Jan 2023",
      end: "Present",
      bullets: JSON.stringify([
        "Built and maintained full-stack web applications using React, TypeScript, and Spring Boot",
        "Designed and implemented RESTful APIs serving thousands of daily requests",
        "Set up CI/CD pipelines with GitHub Actions, reducing deployment time by 60%",
        "Collaborated with cross-functional teams to deliver features on tight deadlines",
      ]),
      order: 0,
    },
  });

  // Education
  await prisma.education.upsert({
    where: { id: "edu-1" },
    update: {},
    create: {
      id: "edu-1",
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      start: "Aug 2019",
      end: "May 2023",
      gpa: "3.8",
      bullets: JSON.stringify([
        "Dean's List — All semesters",
        "Senior Capstone: Built a real-time collaborative code editor",
      ]),
      order: 0,
    },
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
