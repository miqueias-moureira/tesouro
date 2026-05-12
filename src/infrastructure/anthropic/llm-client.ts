import Anthropic from "@anthropic-ai/sdk";
import type { LlmClient } from "@/application/ports";
import type { AgentKind, AgentReport, AgentFinding } from "@/domain/agents/types";
import type { Recommendation, Evidence, Action } from "@/domain/conversation/types";
import type { CreativeBrief } from "@/domain/studio/types";
import type { WeeklyReview } from "@/domain/review/types";
import { TOOLS_BY_AGENT, META_TOOL, GOOGLE_TOOL, TRACR_TOOL, DEPLOY_TOOL, MARKET_TOOL } from "./tools";
import { specialistPrompt, MASTER_PROMPT, STUDIO_PROMPT, REVIEW_PROMPT } from "./prompts";
import { runTool } from "@/infrastructure/data-sources";

const MODEL            = "claude-sonnet-4-6";
const TOKENS_DEFAULT   = 2048;
const TOKENS_REVIEW    = 6144;
const MAX_TOOL_ITERS   = 6;

type ContentBlock  = Anthropic.Messages.ContentBlock;
type MessageParam  = Anthropic.Messages.MessageParam;

const DEFAULT_ACTIONS: Action[] = [
  { id: "redistribute_budget", label: "Aplicar redistribuição" },
  { id: "draft_brief",         label: "Rascunho de brief"      },
  { id: "save_to_notion",      label: "Salvar análise no Notion"},
];

const ALL_TOOLS   = [META_TOOL, GOOGLE_TOOL, TRACR_TOOL, DEPLOY_TOOL, MARKET_TOOL];
const MEDIA_TOOLS = [META_TOOL, GOOGLE_TOOL, TRACR_TOOL];

export class AnthropicLlmClient implements LlmClient {
  private readonly client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async runSpecialist(input: { agent: AgentKind; userQuestion: string }): Promise<AgentReport> {
    const text = await this.runToolLoop({
      system: specialistPrompt(input.agent),
      tools: [...TOOLS_BY_AGENT[input.agent]],
      maxTokens: TOKENS_DEFAULT,
      messages: [{
        role: "user",
        content: `Pergunta do head de growth: "${input.userQuestion}"\n\nUse suas tools para investigar e retorne o JSON conforme especificado.`,
      }],
    });
    const parsed = safeParseJson<{ summary: string; findings: AgentFinding[] }>(text);
    return {
      agent: input.agent,
      summary: parsed?.summary ?? "(sem síntese)",
      findings: parsed?.findings ?? [],
    };
  }

  async runMaster(input: { userQuestion: string; reports: AgentReport[] }): Promise<Recommendation> {
    const reportsBlock = input.reports
      .map((r) => `# Relatório [${r.agent}]\nResumo: ${r.summary}\nFindings: ${JSON.stringify(r.findings, null, 2)}`)
      .join("\n\n");

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: TOKENS_DEFAULT,
      system: MASTER_PROMPT,
      messages: [{
        role: "user",
        content: `Pergunta do head de growth: "${input.userQuestion}"\n\nRelatórios dos especialistas:\n\n${reportsBlock}\n\nSintetize a recomendação no formato JSON especificado.`,
      }],
    });

    const parsed = safeParseJson<{
      headline: string;
      rationale: string;
      evidence: Evidence[];
      actions: Action[];
    }>(extractText(response.content));

    if (!parsed) throw new Error("master agent retornou JSON inválido");
    return {
      headline: parsed.headline,
      rationale: parsed.rationale,
      evidence: parsed.evidence ?? [],
      actions: parsed.actions ?? DEFAULT_ACTIONS,
      agentReports: input.reports,
    };
  }

  async runStudio(input: { partnerName: string; intent: string }): Promise<CreativeBrief> {
    const text = await this.runToolLoop({
      system: STUDIO_PROMPT,
      tools: MEDIA_TOOLS,
      maxTokens: TOKENS_DEFAULT,
      messages: [{
        role: "user",
        content: `Parceria: ${input.partnerName}\nIntenção do diretor de criação: "${input.intent}"\n\nUse as tools para extrair o padrão vencedor e proponha o brief no JSON especificado.`,
      }],
    });
    const parsed = safeParseJson<CreativeBrief>(text);
    if (!parsed) throw new Error("studio retornou JSON inválido");
    return parsed;
  }

  async runReview(input: { partnerName: string; weekLabel: string }): Promise<WeeklyReview> {
    const text = await this.runToolLoop({
      system: REVIEW_PROMPT,
      tools: ALL_TOOLS,
      maxTokens: TOKENS_REVIEW,
      messages: [{
        role: "user",
        content: `Parceria: ${input.partnerName}\nSemana: ${input.weekLabel}\n\nUse TODAS as tools relevantes e compose o Media Review semanal no JSON especificado.`,
      }],
    });

    const parsed = safeParseJson<Omit<WeeklyReview, "partner_slug" | "week_label" | "generated_at">>(text);
    if (!parsed) {
      console.error("[review] raw text:", text.slice(0, 500));
      throw new Error("review retornou JSON inválido");
    }
    return {
      partner_slug: input.partnerName.toLowerCase(),
      week_label: input.weekLabel,
      generated_at: new Date().toISOString(),
      ...parsed,
    };
  }

  private async runToolLoop(args: {
    system: string;
    tools: Anthropic.Messages.Tool[];
    maxTokens: number;
    messages: MessageParam[];
  }): Promise<string> {
    const { system, tools, maxTokens } = args;
    const messages = [...args.messages];

    for (let i = 0; i < MAX_TOOL_ITERS; i++) {
      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        tools,
        messages,
      });

      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        return extractText(response.content);
      }

      const toolResults = response.content
        .filter((b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use")
        .map((block) => ({
          type: "tool_result" as const,
          tool_use_id: block.id,
          content: runTool(block.name),
        }));

      messages.push({ role: "user", content: toolResults });
    }

    throw new Error("excedeu máximo de iterações de tool use");
  }
}

function extractText(content: ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function safeParseJson<T>(text: string): T | null {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // tentativa 1 — texto inteiro
  try { return JSON.parse(cleaned) as T; } catch { /* continua */ }

  // tentativa 2 — extrai do primeiro { até o último }
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(cleaned.slice(start, end + 1)) as T; } catch { /* continua */ }
  }

  return null;
}
