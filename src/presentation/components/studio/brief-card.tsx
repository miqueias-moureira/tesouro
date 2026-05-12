"use client";

import type { CreativeBrief } from "@/domain/studio/types";

export function BriefCard({ brief }: { brief: CreativeBrief }) {
  return (
    <article className="bg-surface border border-border">
      <div className="px-6 py-2.5 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Brief gerado · Studio
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Pista quente
        </span>
      </div>

      <div className="px-6 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
          {brief.spec.channel.toUpperCase()} · {brief.spec.format}
          {brief.spec.duration ? ` · ${brief.spec.duration}` : ""}
        </p>
        <h2 className="font-serif text-2xl text-ink leading-snug">
          {brief.headline}
        </h2>
        <p className="text-ink/80 mt-2">{brief.body}</p>
      </div>

      <div className="px-6 py-5 mt-2 border-t border-border bg-bg/40">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
          Brief para o time de criação
        </p>
        <p className="text-ink whitespace-pre-line leading-relaxed">
          {brief.brief}
        </p>
      </div>

      <div className="px-6 py-5 border-t border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
          Por que esse padrão vence
        </p>
        <ol className="space-y-3">
          {brief.evidence.map((e, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-serif text-2xl text-accent leading-none mt-0.5 select-none">
                {i + 1}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-sm text-ink">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted mr-2">
                    {e.kind}
                  </span>
                  <span className="font-medium">{e.label}</span>
                </p>
                <p className="text-sm text-muted mt-0.5">{e.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Métrica esperada · confiança {brief.expected_metric.confidence}
          </p>
          <p className="text-ink">
            <span className="font-serif text-2xl text-accent mr-2">
              {brief.expected_metric.value}
            </span>
            <span className="text-sm text-muted">
              {brief.expected_metric.label}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Mock: brief enviado para o time")}
            className="px-3 py-1.5 text-sm bg-ink text-bg hover:bg-accent transition-colors"
          >
            Enviar para criação
          </button>
        </div>
      </div>
    </article>
  );
}
