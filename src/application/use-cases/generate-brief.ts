/**
 * APPLICATION — Use Case: GenerateBrief
 *
 * Orquestra geração do brief de próximo criativo via Studio agent.
 */

import type { LlmClient } from "@/application/ports";
import type { CreativeBrief } from "@/domain/studio/types";

export interface GenerateBriefInput {
  partnerName: string;
  intent: string; // "criativo Reels Jeitto", "headline Search aprovação", etc.
}

export class GenerateBriefUseCase {
  constructor(private readonly llm: LlmClient) {}

  async execute(input: GenerateBriefInput): Promise<CreativeBrief> {
    const intent = input.intent.trim();
    if (!intent) throw new Error("intent vazio");
    return this.llm.runStudio({
      partnerName: input.partnerName,
      intent,
    });
  }
}
