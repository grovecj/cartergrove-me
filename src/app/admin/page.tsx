export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, FolderOpen } from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, projectCount, profileExists] = await Promise.all([
    prisma.blogPost.count(),
    prisma.portfolioProject.count(),
    prisma.resumeProfile.findFirst().then((p) => !!p),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your site content.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/resume">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <FileText className="mb-2 h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-lg">Resume</CardTitle>
              <CardDescription>
                {profileExists ? "Profile configured" : "Not yet configured"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/blog">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <BookOpen className="mb-2 h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-lg">Blog</CardTitle>
              <CardDescription>{postCount} posts</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/portfolio">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <FolderOpen className="mb-2 h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-lg">Portfolio</CardTitle>
              <CardDescription>{projectCount} projects</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
