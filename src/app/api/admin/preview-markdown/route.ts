import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  const html = await renderMarkdown(content);
  return NextResponse.json({ html });
}
