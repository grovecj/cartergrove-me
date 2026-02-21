import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    experiences.map((e) => ({
      ...e,
      bullets: JSON.parse(e.bullets),
    }))
  );
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const experiences = await req.json();

  await prisma.workExperience.deleteMany();

  for (const exp of experiences) {
    await prisma.workExperience.create({
      data: {
        company: exp.company,
        title: exp.title,
        location: exp.location,
        start: exp.start,
        end: exp.end,
        bullets: JSON.stringify(exp.bullets),
        order: exp.order,
      },
    });
  }

  return NextResponse.json({ success: true });
}
