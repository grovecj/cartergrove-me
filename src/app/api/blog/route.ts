import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    posts.map((p) => ({ ...p, tags: JSON.parse(p.tags) }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      tags: JSON.stringify(body.tags ?? []),
      published: body.published ?? false,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
