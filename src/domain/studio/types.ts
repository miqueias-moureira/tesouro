/**
 * DOMAIN — Studio
 *
 * Brief do próximo criativo a partir de padrões históricos.
 */

import type { Evidence } from "@/domain/conversation/types";

export interface CreativeBrief {
  /** spec curta: formato, dimensão, canal */
  spec: {
    channel: "meta" | "google" | "tiktok";
    format: string; // "Reels 9:16", "Search RSA", etc
    duration?: string;
  };
  headline: string;
  body: string;
  /** texto curto de brief para o time de criação */
  brief: string;
  /** o que justifica esse brief */
  evidence: Evidence[];
  /** métrica esperada (claim com número) */
  expected_metric: {
    label: string;
    value: string;
    confidence: "low" | "medium" | "high";
  };
}
