import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Mail, FileText, FolderOpen, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
      {/* Hero */}
      <section className="flex flex-col items-center gap-8 text-center">
        <div
          className="stagger-fade-up flex h-20 w-20 items-center justify-center rounded-full border border-border/80 font-serif text-2xl text-muted-foreground"
        >
          CG
        </div>

        <div className="stagger-fade-up space-y-3" style={{ animationDelay: "0.08s" }}>
          <h1 className="font-serif text-5xl tracking-tight sm:text-7xl">
            Carter Grove
          </h1>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
            Software Engineer
          </p>
        </div>

        <div
          className="stagger-fade-up h-px w-12 bg-border"
          style={{ animationDelay: "0.14s" }}
        />

        <p
          className="stagger-fade-up max-w-xl text-base leading-relaxed text-muted-foreground"
          style={{ animationDelay: "0.2s" }}
        >
          Full-stack developer passionate about building clean, performant software.
          I work with TypeScript, React, Spring Boot, and cloud infrastructure to
          ship products that solve real problems.
        </p>

        <div
          className="stagger-fade-up flex items-center gap-5"
          style={{ animationDelay: "0.28s" }}
        >
          <Link
            href="https://github.com/grovecj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
          <span className="text-border">&middot;</span>
          <Link
            href="https://linkedin.com/in/cartergrove"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </Link>
          <span className="text-border">&middot;</span>
          <Link
            href="mailto:carter@cartergrove.me"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-24 grid gap-6 sm:grid-cols-3">
        <Link
          href="/resume"
          className="group stagger-fade-up"
          style={{ animationDelay: "0.36s" }}
        >
          <Card className="border-l-2 border-l-transparent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-l-primary group-hover:shadow-md">
            <CardHeader>
              <FileText className="mb-2 h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
              <CardTitle className="font-serif text-lg">Resume</CardTitle>
              <CardDescription>
                Experience, skills, and education — also available as a PDF download.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href="/portfolio"
          className="group stagger-fade-up"
          style={{ animationDelay: "0.42s" }}
        >
          <Card className="border-l-2 border-l-transparent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-l-primary group-hover:shadow-md">
            <CardHeader>
              <FolderOpen className="mb-2 h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
              <CardTitle className="font-serif text-lg">Portfolio</CardTitle>
              <CardDescription>
                Personal projects including Gif Clipper and MLB Stats.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href="/blog"
          className="group stagger-fade-up"
          style={{ animationDelay: "0.48s" }}
        >
          <Card className="border-l-2 border-l-transparent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-l-primary group-hover:shadow-md">
            <CardHeader>
              <BookOpen className="mb-2 h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
              <CardTitle className="font-serif text-lg">Blog</CardTitle>
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
