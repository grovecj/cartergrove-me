import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development, tooling, and tech by Carter Grove.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const parsed = posts.map((p) => ({
    ...p,
    tags: JSON.parse(p.tags) as string[],
  }));

  const filtered = params.tag
    ? parsed.filter((p) => p.tags.includes(params.tag!))
    : parsed;

  const allTags = [...new Set(parsed.flatMap((p) => p.tags))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Thoughts on software development, tooling, and tech.
      </p>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/blog">
            <Badge variant={!params.tag ? "default" : "outline"}>All</Badge>
          </Link>
          {allTags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge variant={params.tag === tag ? "default" : "outline"}>
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Post list */}
      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <Card className="border-l-2 border-l-transparent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-l-primary group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={post.createdAt.toISOString()}>
                      {post.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <CardTitle className="font-serif text-lg transition-colors group-hover:text-primary">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
