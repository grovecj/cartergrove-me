import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowingLine } from "@/components/ui/growing-line";
import { FadeInView } from "@/components/ui/fade-in-view";
import { Button } from "@/components/ui/button";
import { Download, Mail, MapPin, Globe, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume",
  description: "Carter Grove's professional resume — experience, skills, and education.",
};

async function getResumeData() {
  const [profile, skills, experience, education] = await Promise.all([
    prisma.resumeProfile.findFirst(),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    profile,
    skills: skills.map((s) => ({ ...s, items: JSON.parse(s.items) as string[] })),
    experience: experience.map((e) => ({ ...e, bullets: JSON.parse(e.bullets) as string[] })),
    education: education.map((e) => ({
      ...e,
      bullets: e.bullets ? (JSON.parse(e.bullets) as string[]) : [],
    })),
  };
}

export default async function ResumePage() {
  const { profile, skills, experience, education } = await getResumeData();

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Resume data not yet configured. Seed the database first.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <FadeInView>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-lg text-muted-foreground">{profile.title}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </span>
              <Link href={profile.website} className="flex items-center gap-1 hover:text-foreground">
                <Globe className="h-3.5 w-3.5" /> {profile.website.replace("https://", "")}
              </Link>
              <Link href={`https://github.com/${profile.github}`} className="flex items-center gap-1 hover:text-foreground">
                <Github className="h-3.5 w-3.5" /> {profile.github}
              </Link>
              <Link href={`https://linkedin.com/in/${profile.linkedin}`} className="flex items-center gap-1 hover:text-foreground">
                <Linkedin className="h-3.5 w-3.5" /> {profile.linkedin}
              </Link>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/resume.pdf" target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Link>
          </Button>
        </div>
      </FadeInView>

      <GrowingLine className="my-8" />

      {/* Summary */}
      <FadeInView>
        <section>
          <h2 className="mb-3 text-xl font-semibold">Summary</h2>
          <p className="text-muted-foreground">{profile.summary}</p>
        </section>
      </FadeInView>

      <GrowingLine className="my-8" />

      {/* Skills */}
      <FadeInView>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {skill.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item: string) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </FadeInView>

      <GrowingLine className="my-8" />

      {/* Experience */}
      <FadeInView>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Experience</h2>
          <div className="space-y-6">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company} &middot; {job.location}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.start} &ndash; {job.end}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {job.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </FadeInView>

      <GrowingLine className="my-8" />

      {/* Education */}
      <FadeInView>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} in {edu.field}
                      {edu.gpa && ` — GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {edu.start} &ndash; {edu.end}
                  </p>
                </div>
                {edu.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {edu.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </FadeInView>
    </div>
  );
}
