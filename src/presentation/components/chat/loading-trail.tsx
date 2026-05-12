"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Consultando mídia…",
  "Mapeando jornada…",
  "Conferindo deploys…",
  "Lendo o mercado…",
  "Cruzando pistas…",
];

interface Props {
  label?: string;
}

export function LoadingTrail({ label = "Bússola aponta para…" }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-border bg-surface px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        {label}
      </p>
      <ul className="space-y-1.5">
        {STAGES.map((step, i) => (
          <li
            key={step}
            className={
              i <= stage
                ? "text-ink text-sm flex items-center gap-2"
                : "text-muted/40 text-sm flex items-center gap-2"
            }
          >
            <span
              className={
                i < stage
                  ? "w-1 h-1 rounded-full bg-accent"
                  : i === stage
                    ? "w-1 h-1 rounded-full bg-accent animate-pulse"
                    : "w-1 h-1 rounded-full bg-border"
              }
            />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
