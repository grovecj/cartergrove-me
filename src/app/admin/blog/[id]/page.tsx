"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
}

export default function AdminBlogEditor() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [post, setPost] = useState<PostData>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/blog`)
        .then((r) => r.json())
        .then((posts) => {
          const found = posts.find((p: { id: string }) => p.id === params.id);
          if (found) {
            setPost({
              slug: found.slug,
              title: found.title,
              excerpt: found.excerpt,
              content: found.content,
              tags: found.tags.join(", "),
              published: found.published,
            });
          }
        });
    }
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    const body = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: post.published,
    };

    const res = isNew
      ? await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch(`/api/blog/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/blog");
    }
  };

  const handlePreview = async () => {
    const res = await fetch("/api/admin/preview-markdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: post.content }),
    });
    const data = await res.json();
    setPreviewHtml(data.html);
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">
        {isNew ? "New Post" : "Edit Post"}
      </h1>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={post.tags}
              onChange={(e) => setPost({ ...post, tags: e.target.value })}
            />
          </div>

          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview" onClick={handlePreview}>
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                rows={20}
                className="font-mono text-sm"
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                placeholder="Write your post in Markdown..."
              />
            </TabsContent>
            <TabsContent value="preview">
              <div
                className="prose prose-neutral dark:prose-invert max-w-none rounded-md border p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <Switch
              checked={post.published}
              onCheckedChange={(checked) =>
                setPost({ ...post, published: checked })
              }
            />
            <Label>Published</Label>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isNew ? "Create Post" : "Update Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
