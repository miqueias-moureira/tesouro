/**
 * APPLICATION — Use Case: GenerateReview
 *
 * Gera Media Review semanal para uma parceria. No MVP, on-demand;
 * em produção, dispara pelo scheduler toda sexta 10h.
 */

import type { LlmClient } from "@/application/ports";
import type { WeeklyReview } from "@/domain/review/types";

export interface GenerateReviewInput {
  partnerName: string;
  weekLabel: string;
}

export class GenerateReviewUseCase {
  constructor(private readonly llm: LlmClient) {}

  async execute(input: GenerateReviewInput): Promise<WeeklyReview> {
    return this.llm.runReview({
      partnerName: input.partnerName,
      weekLabel: input.weekLabel,
    });
  }
}
