"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

interface ProjectSlideProps {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  heroImage?: string | null;
  githubUrl?: string | null;
  liveUrl: string;
}

export function ProjectSlide({
  title,
  tagline,
  description,
  techStack,
  features,
  heroImage,
  githubUrl,
  liveUrl,
}: ProjectSlideProps) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Text content */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{tagline}</p>
          </div>
          <p className="text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Site
              </Link>
            </Button>
            {githubUrl && (
              <Button variant="outline" asChild>
                <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Source
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div className="flex items-center justify-center">
          {heroImage ? (
            <img
              src={heroImage}
              alt={`${title} screenshot`}
              className="rounded-lg border shadow-lg"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
