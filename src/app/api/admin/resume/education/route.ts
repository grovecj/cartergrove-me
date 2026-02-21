import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const entries = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    entries.map((e) => ({
      ...e,
      bullets: e.bullets ? JSON.parse(e.bullets) : [],
    }))
  );
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await req.json();

  await prisma.education.deleteMany();

  for (const entry of entries) {
    await prisma.education.create({
      data: {
        school: entry.school,
        degree: entry.degree,
        field: entry.field,
        start: entry.start,
        end: entry.end,
        gpa: entry.gpa || null,
        bullets: entry.bullets?.length ? JSON.stringify(entry.bullets) : null,
        order: entry.order,
      },
    });
  }

  return NextResponse.json({ success: true });
}
