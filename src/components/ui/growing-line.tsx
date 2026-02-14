"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GrowingLineProps {
  className?: string;
}

export function GrowingLine({ className }: GrowingLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("h-px w-full bg-border/50", className)}>
      <div
        className={cn(
          "h-full bg-border transition-all duration-700 ease-out",
          visible ? "w-full" : "w-0"
        )}
      />
    </div>
  );
}
