import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    skills.map((s) => ({
      ...s,
      items: JSON.parse(s.items),
    }))
  );
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const skills = await req.json();

  await prisma.skill.deleteMany();

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        category: skill.category,
        items: JSON.stringify(skill.items),
        order: skill.order,
      },
    });
  }

  return NextResponse.json({ success: true });
}
