/**
 * DOMAIN — Review (Media Review semanal)
 *
 * Documento gerado autonomamente toda sexta 10h.
 * Não é chat — é artefato físico para a reunião com a parceria.
 */

import type { Evidence } from "@/domain/conversation/types";

export interface ChannelLine {
  channel: string;
  spend: string;
  delta_vs_prev: string;
  cvr: string;
  roas: string;
  verdict: "winner" | "loser" | "watch";
  note: string;
}

export interface ReviewRecommendation {
  title: string;
  detail: string;
  evidence: Evidence[];
}

export interface ProposedTest {
  hypothesis: string;
  channel: string;
  expected_lift: string;
}

export interface HistoryItem {
  what: string;
  result: string;
  verdict: "worked" | "failed";
}

export interface TopCreative {
  format: string;
  channel: string;
  metric: string;
  description: string;
}

export interface WeeklyReview {
  partner_slug: string;
  week_label: string; // "Semana 19 · 06–12/05"
  generated_at: string; // ISO
  /** sumário em 2-3 frases */
  executive_summary: string;
  channel_table: ChannelLine[];
  /** vencedor da semana com evidência */
  winner: { headline: string; detail: string };
  /** ofensor da semana com evidência */
  loser: { headline: string; detail: string };
  /** contexto externo (mercado, espontânea) */
  context: string;
  recommendations: ReviewRecommendation[];
  proposed_tests: ProposedTest[];
  /** o que foi aplicado e qual foi o resultado */
  history?: HistoryItem[];
  /** top criativos por canal — output para o time de design */
  top_creatives?: TopCreative[];
}
