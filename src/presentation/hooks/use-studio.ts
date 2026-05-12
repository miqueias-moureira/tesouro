"use client";

import { useState, useCallback } from "react";
import type { CreativeBrief } from "@/domain/studio/types";

export function useStudio(partnerSlug: string) {
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (intent: string) => {
      const trimmed = intent.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      setBrief(null);
      try {
        const res = await fetch("/api/studio", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ partner: partnerSlug, intent: trimmed }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(err.message ?? "falha ao gerar brief");
        }
        setBrief((await res.json()) as CreativeBrief);
      } catch (e) {
        setError(e instanceof Error ? e.message : "erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [partnerSlug]
  );

  return { brief, loading, error, generate };
}
