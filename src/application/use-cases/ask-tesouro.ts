/**
 * APPLICATION — Use Case: AskTesouro
 *
 * É o coração do produto. Recebe a pergunta, dispara os 4 sub-agentes
 * em PARALELO (esse é o ponto técnico que mata o "é só CSV+GPT"),
 * passa os relatórios para o master sintetizar, e devolve a
 * recomendação estruturada.
 *
 * Análogo a um use-case em Go:
 *
 *   type AskTesouroUseCase struct {
 *       llm LlmClient
 *   }
 *
 *   func (u *AskTesouroUseCase) Execute(ctx, q) (Recommendation, error) { ... }
 */

import type { LlmClient } from "@/application/ports";
import type { AgentKind } from "@/domain/agents/types";
import type { Recommendation } from "@/domain/conversation/types";

const SPECIALISTS: AgentKind[] = ["media", "journey", "product", "market"];

export interface AskTesouroInput {
  question: string;
}

export class AskTesouroUseCase {
  constructor(private readonly llm: LlmClient) {}

  async execute(input: AskTesouroInput): Promise<Recommendation> {
    const question = input.question.trim();
    if (!question) {
      throw new Error("pergunta vazia");
    }

    // Dispatch paralelo — esse é o diferencial.
    // Em Go seria errgroup.Group; aqui é Promise.all.
    const reports = await Promise.all(
      SPECIALISTS.map((agent) =>
        this.llm.runSpecialist({ agent, userQuestion: question })
      )
    );

    // O master recebe todos os relatórios e sintetiza.
    return this.llm.runMaster({ userQuestion: question, reports });
  }
}
