import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbsProps = {
  items: { label: string; href?: string }[];
  light?: boolean;
};

export function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-widest2",
        light ? "text-white/60" : "text-inkMuted"
      )}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "transition-colors",
                light ? "hover:text-white" : "hover:text-terra"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={light ? "text-white/90" : "text-terra"}>{item.label}</span>
          )}
          {i < items.length - 1 && (
            <ChevronRight className="h-3 w-3 opacity-50" />
          )}
        </span>
      ))}
    </nav>
  );
}
