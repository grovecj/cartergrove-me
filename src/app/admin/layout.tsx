import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/resume"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Resume
          </Link>
          <Link
            href="/admin/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/admin/portfolio"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Portfolio
          </Link>
        </nav>
        <AdminSignOut />
      </div>
      {children}
    </div>
  );
}
