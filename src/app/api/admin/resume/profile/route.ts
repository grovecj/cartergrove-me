import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.resumeProfile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await prisma.resumeProfile.findFirst();

  const data = {
    name: body.name,
    title: body.title,
    email: body.email,
    phone: body.phone,
    location: body.location,
    website: body.website,
    github: body.github,
    linkedin: body.linkedin,
    summary: body.summary,
  };

  const profile = existing
    ? await prisma.resumeProfile.update({ where: { id: existing.id }, data })
    : await prisma.resumeProfile.create({ data });

  return NextResponse.json(profile);
}
