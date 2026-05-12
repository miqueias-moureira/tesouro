/**
 * DOMAIN — Conversation
 *
 * Tipos do "produto" propriamente dito: a pergunta do usuário, a
 * recomendação final do master, ações executáveis. Stateless e puros.
 */

import type { AgentReport } from "@/domain/agents/types";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string; // ISO
}

export interface Evidence {
  kind: "metric" | "deploy" | "creative" | "market";
  label: string;
  detail: string;
  /** opcional: link interno para o sistema de origem */
  href?: string;
}

export interface Action {
  /** id de ação executável (mockada no MVP) */
  id: "redistribute_budget" | "draft_brief" | "save_to_notion";
  label: string;
}

/**
 * Resposta estruturada do Master Agent — é o que renderiza no card.
 * Pense nisso como o DTO final que sai do use-case.
 */
export interface Recommendation {
  /** o "veredito" em uma frase */
  headline: string;
  /** 1 parágrafo de contexto */
  rationale: string;
  /** as "3 pistas cruzadas" — não-negociável: o diferencial vs. CSV+GPT */
  evidence: Evidence[];
  /** botões de ação ao final do card */
  actions: Action[];
  /** relatórios dos sub-agentes (para o usuário curioso) */
  agentReports: AgentReport[];
}
