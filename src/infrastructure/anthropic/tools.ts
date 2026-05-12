/**
 * INFRASTRUCTURE — Tool definitions (Anthropic tool use)
 *
 * Cada sub-agente recebe UMA tool específica que lê seu dataset
 * mockado. O nome e a descrição da tool importam: é o que o modelo
 * usa para decidir quando chamar.
 *
 * Quando trocar mock por API real, é SÓ trocar a implementação no
 * adapter — o schema da tool e o domínio não mudam.
 */

import type Anthropic from "@anthropic-ai/sdk";

type Tool = Anthropic.Messages.Tool;

export const META_TOOL: Tool = {
  name: "read_meta_ads",
  description:
    "Lê o desempenho recente das campanhas Meta Ads (Reels, Feed, Stories): spend, CVR, CTR, ROAS dos últimos 14 dias.",
  input_schema: {
    type: "object" as const,
    properties: {},
  },
};

export const GOOGLE_TOOL: Tool = {
  name: "read_google_ads",
  description:
    "Lê o desempenho recente das campanhas Google Ads (Search, Performance Max): spend, CTR, CVR, ROAS dos últimos 14 dias.",
  input_schema: { type: "object" as const, properties: {} },
};

export const TRACR_TOOL: Tool = {
  name: "read_journey",
  description:
    "Lê o funil de jornada via Tracr: views → form starts → completes → approved, com taxas por estágio e anomalias detectadas.",
  input_schema: { type: "object" as const, properties: {} },
};

export const DEPLOY_TOOL: Tool = {
  name: "read_deploys",
  description:
    "Lê o histórico de deploys do site/produto: versão, data, escopo (landing/form) e mudanças aplicadas.",
  input_schema: { type: "object" as const, properties: {} },
};

export const MARKET_TOOL: Tool = {
  name: "read_market",
  description:
    "Lê o contexto de mercado: sazonalidade, mídia espontânea recente e pressão competitiva.",
  input_schema: { type: "object" as const, properties: {} },
};

/** mapeamento agent → tool(s) usado pelo adapter */
export const TOOLS_BY_AGENT = {
  media: [META_TOOL, GOOGLE_TOOL],
  journey: [TRACR_TOOL],
  product: [DEPLOY_TOOL],
  market: [MARKET_TOOL],
} as const;
