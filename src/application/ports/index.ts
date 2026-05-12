/**
 * APPLICATION — Ports
 *
 * Interfaces que a application layer define e a infra implementa.
 * Application NUNCA importa de @/infrastructure.
 */

import type { AgentKind, AgentReport } from "@/domain/agents/types";
import type { Recommendation } from "@/domain/conversation/types";
import type { Credentials, User } from "@/domain/auth/types";
import type { CreativeBrief } from "@/domain/studio/types";
import type { WeeklyReview } from "@/domain/review/types";

/**
 * Cliente do LLM. Abstrai o Anthropic SDK.
 */
export interface LlmClient {
  /** Roda um sub-agente especialista (Allocator) */
  runSpecialist(input: {
    agent: AgentKind;
    userQuestion: string;
  }): Promise<AgentReport>;

  /** Master do Allocator: sintetiza recomendação cruzada */
  runMaster(input: {
    userQuestion: string;
    reports: AgentReport[];
  }): Promise<Recommendation>;

  /** Studio: gera brief do próximo criativo */
  runStudio(input: {
    partnerName: string;
    intent: string;
  }): Promise<CreativeBrief>;

  /** Review: gera Media Review semanal */
  runReview(input: {
    partnerName: string;
    weekLabel: string;
  }): Promise<WeeklyReview>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  verifyCredentials(creds: Credentials): Promise<User | null>;
}
