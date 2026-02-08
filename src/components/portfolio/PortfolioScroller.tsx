"use client";

import { useEffect, useRef, useState } from "react";
import { SubdomainHeader } from "./SubdomainHeader";
import { ProjectSlide } from "./ProjectSlide";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title: string;
  subdomain: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  heroImage: string | null;
  githubUrl: string | null;
  liveUrl: string;
  order: number;
}

interface PortfolioScrollerProps {
  projects: Project[];
}

export function PortfolioScroller({ projects }: PortfolioScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers = slideRefs.current.map((slide, index) => {
      if (!slide) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(slide);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, [projects]);

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex h-[calc(100svh-4rem)] flex-col">
      {/* Sticky subdomain header */}
      <div className="sticky top-16 z-10 flex items-center justify-center bg-background/80 py-4 backdrop-blur-sm">
        <SubdomainHeader subdomain={projects[activeIndex]?.subdomain ?? ""} />
      </div>

      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="flex-1 snap-y snap-mandatory overflow-y-auto"
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { slideRefs.current[index] = el; }}
            className="flex h-full snap-start snap-always"
          >
            <ProjectSlide
              title={project.title}
              tagline={project.tagline}
              description={project.description}
              techStack={project.techStack}
              features={project.features}
              heroImage={project.heroImage}
              githubUrl={project.githubUrl}
              liveUrl={project.liveUrl}
            />
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full border transition-all",
              activeIndex === index
                ? "scale-125 border-primary bg-primary"
                : "border-muted-foreground/50 bg-transparent hover:bg-muted-foreground/30"
            )}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
