import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const banner = await prisma.banner.create({
    data: {
      message: body.message,
      link: body.link || null,
      linkText: body.linkText || null,
      variant: body.variant || "info",
      pagePath: body.pagePath || null,
      active: body.active ?? true,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(banner);
}
