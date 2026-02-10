"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

interface Banner {
  id: string;
  message: string;
  link: string | null;
  linkText: string | null;
  variant: string;
  pagePath: string | null;
}

const variantStyles: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: Info,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    icon: AlertTriangle,
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    icon: CheckCircle,
  },
};

export function BannerDisplay() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then(setBanners)
      .catch(() => {});
  }, []);

  const visible = banners.filter(
    (b) => !b.pagePath || b.pagePath === pathname
  );

  if (visible.length === 0) return null;

  return (
    <div>
      {visible.map((banner) => {
        const style = variantStyles[banner.variant] || variantStyles.info;
        const Icon = style.icon;

        return (
          <div
            key={banner.id}
            className={`border-b px-4 py-2.5 text-center text-sm ${style.bg} ${style.text}`}
          >
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{banner.message}</span>
              {banner.link && (
                <a
                  href={banner.link}
                  className="ml-1 underline underline-offset-2 hover:opacity-80"
                >
                  {banner.linkText || "Learn more"}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
