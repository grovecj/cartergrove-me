import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.portfolioProject.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      techStack: JSON.parse(p.techStack),
      features: JSON.parse(p.features),
    }))
  );
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await req.json();

  // Delete all existing, then recreate (simple approach for small dataset)
  await prisma.portfolioProject.deleteMany();

  for (const project of projects) {
    await prisma.portfolioProject.create({
      data: {
        slug: project.slug,
        title: project.title,
        subdomain: project.subdomain,
        tagline: project.tagline,
        description: project.description,
        techStack: JSON.stringify(project.techStack),
        features: JSON.stringify(project.features),
        heroImage: project.heroImage || null,
        githubUrl: project.githubUrl || null,
        liveUrl: project.liveUrl,
        order: project.order,
      },
    });
  }

  return NextResponse.json({ success: true });
}
