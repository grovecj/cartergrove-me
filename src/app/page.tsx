import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Mail, FileText, FolderOpen, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted text-3xl font-bold text-muted-foreground">
          CG
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Carter Grove
          </h1>
          <p className="text-xl text-muted-foreground">Software Engineer</p>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Full-stack developer passionate about building clean, performant software.
          I work with TypeScript, React, Spring Boot, and cloud infrastructure to
          ship products that solve real problems.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link
              href="https://github.com/grovecj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link
              href="https://linkedin.com/in/cartergrove"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="mailto:carter@cartergrove.me">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        <Link href="/resume" className="group">
          <Card className="transition-shadow group-hover:shadow-md">
            <CardHeader>
              <FileText className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
              <CardTitle>Resume</CardTitle>
              <CardDescription>
                Experience, skills, and education — also available as a PDF download.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/portfolio" className="group">
          <Card className="transition-shadow group-hover:shadow-md">
            <CardHeader>
              <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>
                Personal projects including Gif Clipper and MLB Stats.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/blog" className="group">
          <Card className="transition-shadow group-hover:shadow-md">
            <CardHeader>
              <BookOpen className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
              <CardTitle>Blog</CardTitle>
              <CardDescription>
                Thoughts on software development, tooling, and tech.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </div>
  );
}
