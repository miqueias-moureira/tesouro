"use client";

import { useState, useCallback } from "react";
import type { Recommendation } from "@/domain/conversation/types";

/**
 * PRESENTATION HOOK
 *
 * Isola o fetch para /api/ask da página. A página fica declarativa
 * (turns, loading, error) e o hook concentra o transporte HTTP.
 *
 * Em Go isso seria o equivalente a um "client" no pacote de
 * apresentação que sabe falar com seu próprio backend.
 */

interface Turn {
  question: string;
  recommendation?: Recommendation;
  error?: string;
}

export function useTesouro() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setTurns((prev) => [...prev, { question: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(err.message ?? "falha ao consultar o Tesouro");
      }

      const recommendation = (await res.json()) as Recommendation;
      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last) last.recommendation = recommendation;
        return next;
      });
    } catch (e) {
      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last) {
          last.error = e instanceof Error ? e.message : "erro desconhecido";
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { turns, loading, ask };
}
