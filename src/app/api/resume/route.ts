import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [profile, skills, experience, education] = await Promise.all([
    prisma.resumeProfile.findFirst(),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
  ]);

  return NextResponse.json({
    profile,
    skills: skills.map((s) => ({ ...s, items: JSON.parse(s.items) })),
    experience: experience.map((e) => ({ ...e, bullets: JSON.parse(e.bullets) })),
    education: education.map((e) => ({
      ...e,
      bullets: e.bullets ? JSON.parse(e.bullets) : [],
    })),
  });
}
