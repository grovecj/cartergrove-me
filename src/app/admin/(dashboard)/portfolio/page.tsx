"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Project {
  id?: string;
  slug: string;
  title: string;
  subdomain: string;
  tagline: string;
  description: string;
  techStack: string;
  features: string;
  heroImage: string;
  githubUrl: string;
  liveUrl: string;
  order: number;
}

const emptyProject: Project = {
  slug: "",
  title: "",
  subdomain: "",
  tagline: "",
  description: "",
  techStack: "",
  features: "",
  heroImage: "",
  githubUrl: "",
  liveUrl: "",
  order: 0,
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then((r) => r.json())
      .then((data) =>
        setProjects(
          data.map((p: Record<string, unknown>) => ({
            ...p,
            techStack: (p.techStack as string[]).join(", "),
            features: (p.features as string[]).join("\n"),
          }))
        )
      );
  }, []);

  const addProject = () => {
    setProjects([...projects, { ...emptyProject, order: projects.length }]);
  };

  const removeProject = (index: number) => {
    const p = projects[index];
    if (p.id) {
      fetch(`/api/admin/portfolio/${p.id}`, { method: "DELETE" });
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    setProjects(
      projects.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        projects.map((p, i) => ({
          ...p,
          techStack: p.techStack.split(",").map((t) => t.trim()).filter(Boolean),
          features: p.features.split("\n").filter(Boolean),
          order: i,
        }))
      ),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved!" : "Error saving.");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Manager</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} projects</p>
        </div>
        <Button onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {projects.map((project, index) => (
          <Card key={project.id ?? index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">
                {project.title || "New Project"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProject(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => updateProject(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={project.slug}
                    onChange={(e) => updateProject(index, { slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subdomain</Label>
                  <Input
                    value={project.subdomain}
                    onChange={(e) => updateProject(index, { subdomain: e.target.value })}
                    placeholder="e.g. gif"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={project.tagline}
                    onChange={(e) => updateProject(index, { tagline: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Live URL</Label>
                  <Input
                    value={project.liveUrl}
                    onChange={(e) => updateProject(index, { liveUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input
                    value={project.githubUrl}
                    onChange={(e) => updateProject(index, { githubUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={project.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                />
              </div>
              <div>
                <Label>Tech Stack (comma-separated)</Label>
                <Input
                  value={project.techStack}
                  onChange={(e) => updateProject(index, { techStack: e.target.value })}
                />
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  rows={3}
                  value={project.features}
                  onChange={(e) => updateProject(index, { features: e.target.value })}
                />
              </div>
              <div>
                <Label>Hero Image URL</Label>
                <Input
                  value={project.heroImage}
                  onChange={(e) => updateProject(index, { heroImage: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All Projects"}
        </Button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    </div>
  );
}
