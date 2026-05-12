"use client";

import { useState, useCallback } from "react";
import type { WeeklyReview } from "@/domain/review/types";

export function useReview(partnerSlug: string) {
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (weekLabel: string) => {
      setLoading(true);
      setError(null);
      setReview(null);
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ partner: partnerSlug, weekLabel }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(err.message ?? "falha ao gerar review");
        }
        setReview((await res.json()) as WeeklyReview);
      } catch (e) {
        setError(e instanceof Error ? e.message : "erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [partnerSlug]
  );

  return { review, loading, error, generate };
}
