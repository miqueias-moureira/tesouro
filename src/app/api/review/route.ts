import { NextResponse } from "next/server";
import { z } from "zod";
import { GenerateReviewUseCase } from "@/application/use-cases/generate-review";
import { AnthropicLlmClient } from "@/infrastructure/anthropic/llm-client";
import { JsonPartnerRepository } from "@/infrastructure/partners/repository";

const bodySchema = z.object({
  partner: z.string().min(1),
  weekLabel: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const partner = await new JsonPartnerRepository().findBySlug(parsed.data.partner);
  if (!partner) {
    return NextResponse.json({ error: "partner_not_found" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const llm = new AnthropicLlmClient(apiKey);
  const useCase = new GenerateReviewUseCase(llm);

  try {
    const review = await useCase.execute({ partnerName: partner.name, weekLabel: parsed.data.weekLabel });
    return NextResponse.json(review);
  } catch (err) {
    console.error("[review] erro:", err);
    return NextResponse.json(
      { error: "review_failure", message: err instanceof Error ? err.message : "erro desconhecido" },
      { status: 500 }
    );
  }
}
