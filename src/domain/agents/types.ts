/**
 * DOMAIN — Agents
 *
 * Análogo a `internal/domain/agent` em Go: tipos puros, sem
 * dependência de framework. Nenhum import de Next, Anthropic SDK
 * ou React aqui.
 */

export type AgentKind = "media" | "journey" | "product" | "market";

export interface AgentFinding {
  /** chave curta — usada como id na UI e no master */
  id: string;
  /** texto da pista, escrito como se fosse para um humano */
  text: string;
  /** força do sinal — afeta como o master prioriza */
  confidence: "low" | "medium" | "high";
  /** referência à evidência bruta (campanha, deploy, etc.) */
  evidenceRef?: string;
}

export interface AgentReport {
  agent: AgentKind;
  /** resumo de 1-2 linhas que o master vai ler */
  summary: string;
  findings: AgentFinding[];
}
