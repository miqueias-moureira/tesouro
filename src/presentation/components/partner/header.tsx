"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Partner } from "@/domain/partners/types";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "", label: "Home" },
  { href: "/allocator", label: "Allocator" },
  { href: "/studio", label: "Studio" },
  { href: "/reviews", label: "Reviews" },
];

export function PartnerHeader({ partner }: { partner: Partner }) {
  const pathname = usePathname();
  const base = `/${partner.slug}`;

  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-serif text-lg text-ink">Tesouro</span>
          </Link>
          <span className="text-border">·</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Parceria
            </span>
            <span className="text-ink font-medium">{partner.name}</span>
          </div>
        </div>

        <span className="text-xs text-muted font-mono">R2 Ventures</span>
      </div>

      <nav className="max-w-5xl mx-auto px-6 flex gap-6 border-t border-border/50">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const active =
            tab.href === ""
              ? pathname === base
              : pathname.startsWith(href);
          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "py-3 text-sm border-b-2 -mb-px transition-colors",
                active
                  ? "border-accent text-ink"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
