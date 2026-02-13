import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-serif">Carter Grove</span>
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/grovecj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4.5 w-4.5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://linkedin.com/in/cartergrove"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4.5 w-4.5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="mailto:carter@cartergrove.me"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4.5 w-4.5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
