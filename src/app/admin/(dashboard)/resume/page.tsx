"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

interface SkillData {
  id?: string;
  category: string;
  items: string; // comma-separated in UI
  order: number;
}

interface ExperienceData {
  id?: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bullets: string; // one per line in UI
  order: number;
}

interface EducationData {
  id?: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  gpa: string;
  bullets: string; // one per line in UI
  order: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function SaveBar({
  onSave,
  saving,
  message,
  label,
}: {
  onSave: () => void;
  saving: boolean;
  message: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : label}
      </Button>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminResumePage() {
  /* --- Profile state --- */
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  /* --- Skills state --- */
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [skillsMsg, setSkillsMsg] = useState("");

  /* --- Experience state --- */
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [expSaving, setExpSaving] = useState(false);
  const [expMsg, setExpMsg] = useState("");

  /* --- Education state --- */
  const [education, setEducation] = useState<EducationData[]>([]);
  const [eduSaving, setEduSaving] = useState(false);
  const [eduMsg, setEduMsg] = useState("");

  /* --- Fetch all on mount --- */
  useEffect(() => {
    fetch("/api/admin/resume/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data) setProfile(data);
      });

    fetch("/api/admin/resume/skills")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) =>
        setSkills(
          data.map((s) => ({
            ...s,
            items: (s.items as string[]).join(", "),
          })) as SkillData[]
        )
      );

    fetch("/api/admin/resume/experience")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) =>
        setExperiences(
          data.map((e) => ({
            ...e,
            bullets: (e.bullets as string[]).join("\n"),
          })) as ExperienceData[]
        )
      );

    fetch("/api/admin/resume/education")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) =>
        setEducation(
          data.map((e) => ({
            ...e,
            gpa: (e.gpa as string) ?? "",
            bullets: (e.bullets as string[]).join("\n"),
          })) as EducationData[]
        )
      );
  }, []);

  /* --- Profile save --- */
  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    const res = await fetch("/api/admin/resume/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setProfileSaving(false);
    setProfileMsg(res.ok ? "Saved!" : "Error saving.");
  };

  /* --- Skills helpers --- */
  const addSkill = () =>
    setSkills([...skills, { id: crypto.randomUUID(), category: "", items: "", order: skills.length }]);

  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  const updateSkill = (i: number, updates: Partial<SkillData>) =>
    setSkills(skills.map((s, idx) => (idx === i ? { ...s, ...updates } : s)));

  const handleSkillsSave = async () => {
    setSkillsSaving(true);
    setSkillsMsg("");
    const res = await fetch("/api/admin/resume/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        skills.map((s, i) => ({
          category: s.category,
          items: s.items.split(",").map((t) => t.trim()).filter(Boolean),
          order: i,
        }))
      ),
    });
    setSkillsSaving(false);
    setSkillsMsg(res.ok ? "Saved!" : "Error saving.");
  };

  /* --- Experience helpers --- */
  const addExperience = () =>
    setExperiences([
      ...experiences,
      { id: crypto.randomUUID(), company: "", title: "", location: "", start: "", end: "", bullets: "", order: experiences.length },
    ]);

  const removeExperience = (i: number) =>
    setExperiences(experiences.filter((_, idx) => idx !== i));

  const updateExperience = (i: number, updates: Partial<ExperienceData>) =>
    setExperiences(experiences.map((e, idx) => (idx === i ? { ...e, ...updates } : e)));

  const handleExpSave = async () => {
    setExpSaving(true);
    setExpMsg("");
    const res = await fetch("/api/admin/resume/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        experiences.map((e, i) => ({
          company: e.company,
          title: e.title,
          location: e.location,
          start: e.start,
          end: e.end,
          bullets: e.bullets.split("\n").map((line) => line.trim()).filter(Boolean),
          order: i,
        }))
      ),
    });
    setExpSaving(false);
    setExpMsg(res.ok ? "Saved!" : "Error saving.");
  };

  /* --- Education helpers --- */
  const addEducation = () =>
    setEducation([
      ...education,
      { id: crypto.randomUUID(), school: "", degree: "", field: "", start: "", end: "", gpa: "", bullets: "", order: education.length },
    ]);

  const removeEducation = (i: number) =>
    setEducation(education.filter((_, idx) => idx !== i));

  const updateEducation = (i: number, updates: Partial<EducationData>) =>
    setEducation(education.map((e, idx) => (idx === i ? { ...e, ...updates } : e)));

  const handleEduSave = async () => {
    setEduSaving(true);
    setEduMsg("");
    const res = await fetch("/api/admin/resume/education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        education.map((e, i) => {
          const trimmedGpa = e.gpa?.trim();
          return {
            school: e.school,
            degree: e.degree,
            field: e.field,
            start: e.start,
            end: e.end,
            gpa: trimmedGpa || null,
            bullets: e.bullets.split("\n").map((line) => line.trim()).filter(Boolean),
            order: i,
          };
        })
      ),
    });
    setEduSaving(false);
    setEduMsg(res.ok ? "Saved!" : "Error saving.");
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div>
      <h1 className="text-2xl font-bold">Resume Editor</h1>
      <p className="mt-1 text-muted-foreground">
        Edit your profile, skills, experience, and education.
      </p>

      {/* ============================================================ */}
      {/*  PROFILE                                                      */}
      {/* ============================================================ */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub Username</Label>
              <Input
                id="github"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn Username</Label>
              <Input
                id="linkedin"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              rows={4}
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            />
          </div>

          <Separator />

          <SaveBar
            onSave={handleProfileSave}
            saving={profileSaving}
            message={profileMsg}
            label="Save Profile"
          />
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/*  SKILLS                                                       */}
      {/* ============================================================ */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button variant="outline" size="sm" onClick={addSkill}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {skills.map((skill, index) => (
          <Card key={skill.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                {skill.category || "New Skill Category"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} aria-label="Remove skill category">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkill(index, { category: e.target.value })}
                    placeholder="e.g. Languages"
                  />
                </div>
                <div>
                  <Label>Items (comma-separated)</Label>
                  <Input
                    value={skill.items}
                    onChange={(e) => updateSkill(index, { items: e.target.value })}
                    placeholder="e.g. Java, TypeScript, SQL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <SaveBar
          onSave={handleSkillsSave}
          saving={skillsSaving}
          message={skillsMsg}
          label="Save Skills"
        />
      </div>

      {/* ============================================================ */}
      {/*  EXPERIENCE                                                   */}
      {/* ============================================================ */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button variant="outline" size="sm" onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" />
          Add Position
        </Button>
      </div>

      <div className="mt-4 space-y-6">
        {experiences.map((exp, index) => (
          <Card key={exp.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                {exp.title && exp.company
                  ? `${exp.title} — ${exp.company}`
                  : "New Position"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeExperience(index)} aria-label="Remove position">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, { company: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(index, { location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start</Label>
                    <Input
                      value={exp.start}
                      onChange={(e) => updateExperience(index, { start: e.target.value })}
                      placeholder="e.g. Sept 2022"
                    />
                  </div>
                  <div>
                    <Label>End</Label>
                    <Input
                      value={exp.end}
                      onChange={(e) => updateExperience(index, { end: e.target.value })}
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Bullets (one per line)</Label>
                <Textarea
                  rows={4}
                  value={exp.bullets}
                  onChange={(e) => updateExperience(index, { bullets: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <SaveBar
          onSave={handleExpSave}
          saving={expSaving}
          message={expMsg}
          label="Save Experience"
        />
      </div>

      {/* ============================================================ */}
      {/*  EDUCATION                                                    */}
      {/* ============================================================ */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button variant="outline" size="sm" onClick={addEducation}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="mt-4 space-y-6">
        {education.map((edu, index) => (
          <Card key={edu.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                {edu.school || "New Education Entry"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} aria-label="Remove education entry">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(index, { school: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <Label>Field</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(index, { field: e.target.value })}
                    placeholder="e.g. Software Development"
                  />
                </div>
                <div>
                  <Label>GPA (optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Start</Label>
                  <Input
                    value={edu.start}
                    onChange={(e) => updateEducation(index, { start: e.target.value })}
                    placeholder="e.g. 2016"
                  />
                </div>
                <div>
                  <Label>End</Label>
                  <Input
                    value={edu.end}
                    onChange={(e) => updateEducation(index, { end: e.target.value })}
                    placeholder="e.g. Fall 2017"
                  />
                </div>
              </div>
              <div>
                <Label>Bullets (one per line, optional)</Label>
                <Textarea
                  rows={3}
                  value={edu.bullets}
                  onChange={(e) => updateEducation(index, { bullets: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 mb-10">
        <SaveBar
          onSave={handleEduSave}
          saving={eduSaving}
          message={eduMsg}
          label="Save Education"
        />
      </div>
    </div>
  );
}
