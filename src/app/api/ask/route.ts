import { NextResponse } from "next/server";
import { z } from "zod";
import { AskTesouroUseCase } from "@/application/use-cases/ask-tesouro";
import { AnthropicLlmClient } from "@/infrastructure/anthropic/llm-client";

const bodySchema = z.object({
  question: z.string().min(3).max(2000),
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const llm = new AnthropicLlmClient(apiKey);
  const useCase = new AskTesouroUseCase(llm);

  try {
    const recommendation = await useCase.execute({ question: parsed.data.question });
    return NextResponse.json(recommendation);
  } catch (err) {
    console.error("[ask] erro:", err);
    return NextResponse.json(
      { error: "agent_failure", message: err instanceof Error ? err.message : "erro desconhecido" },
      { status: 500 }
    );
  }
}
