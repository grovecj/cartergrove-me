import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PortfolioScroller } from "@/components/portfolio/PortfolioScroller";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal software projects by Carter Grove.",
};

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { order: "asc" },
  });

  const parsed = projects.map((p) => ({
    ...p,
    techStack: JSON.parse(p.techStack) as string[],
    features: JSON.parse(p.features) as string[],
  }));

  if (parsed.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground">No projects yet. Add some via the admin CMS.</p>
      </div>
    );
  }

  return <PortfolioScroller projects={parsed} />;
}
