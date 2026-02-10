"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Banner {
  id: string;
  message: string;
  link: string | null;
  linkText: string | null;
  variant: string;
  pagePath: string | null;
  active: boolean;
  order: number;
}

const VARIANT_OPTIONS = ["info", "warning", "success"] as const;

const PAGE_OPTIONS = [
  { value: "", label: "Global (all pages)" },
  { value: "/", label: "Home" },
  { value: "/resume", label: "Resume" },
  { value: "/portfolio", label: "Portfolio" },
  { value: "/blog", label: "Blog" },
];

const emptyForm = {
  message: "",
  link: "",
  linkText: "",
  variant: "info",
  pagePath: "",
  active: true,
  order: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    fetch("/api/admin/banners")
      .then((r) => r.json())
      .then(setBanners);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setBanners(banners.map((b) => (b.id === id ? { ...b, active } : b)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setBanners(banners.filter((b) => b.id !== id));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      message: banner.message,
      link: banner.link || "",
      linkText: banner.linkText || "",
      variant: banner.variant,
      pagePath: banner.pagePath || "",
      active: banner.active,
      order: banner.order,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      link: form.link || null,
      linkText: form.linkText || null,
      pagePath: form.pagePath || null,
    };

    if (editingId) {
      await fetch(`/api/admin/banners/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setDialogOpen(false);
    fetchBanners();
  };

  const variantColor = (v: string) => {
    if (v === "warning") return "outline" as const;
    if (v === "success") return "default" as const;
    return "secondary" as const;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banner Manager</h1>
          <p className="mt-1 text-muted-foreground">
            {banners.length} banner{banners.length !== 1 && "s"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Banner" : "Create Banner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="link">Link URL (optional)</Label>
                  <Input
                    id="link"
                    value={form.link}
                    onChange={(e) =>
                      setForm({ ...form, link: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkText">Link Text (optional)</Label>
                  <Input
                    id="linkText"
                    value={form.linkText}
                    onChange={(e) =>
                      setForm({ ...form, linkText: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variant">Variant</Label>
                  <select
                    id="variant"
                    value={form.variant}
                    onChange={(e) =>
                      setForm({ ...form, variant: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {VARIANT_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pagePath">Page</Label>
                  <select
                    id="pagePath"
                    value={form.pagePath}
                    onChange={(e) =>
                      setForm({ ...form, pagePath: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {PAGE_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="active"
                    checked={form.active}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Save Changes" : "Create Banner"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 space-y-3">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-base">{banner.message}</CardTitle>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={variantColor(banner.variant)}>
                    {banner.variant}
                  </Badge>
                  <Badge variant="secondary">
                    {banner.pagePath || "Global"}
                  </Badge>
                  {banner.link && (
                    <span className="text-xs text-muted-foreground">
                      {banner.linkText || banner.link}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={banner.active}
                  onCheckedChange={(checked) =>
                    handleToggle(banner.id, checked)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(banner)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
