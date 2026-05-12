"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useStudio } from "@/presentation/hooks/use-studio";
import { BriefCard } from "@/presentation/components/studio/brief-card";
import { LoadingTrail } from "@/presentation/components/chat/loading-trail";

const PRESETS = [
  "Próximo Reels Jeitto baseado no que está vencendo",
  "Headline de Search que recupere CTR após v3.2",
  "Variante de criativo Feed inspirada no padrão de Reels",
];

export default function StudioPage() {
  const params = useParams<{ partner: string }>();
  const { brief, loading, error, generate } = useStudio(params.partner);
  const [intent, setIntent] = useState("");

  function submit() {
    generate(intent);
    setIntent("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
          Studio
        </p>
        <h1 className="font-serif text-3xl text-ink mb-1">
          Crie o próximo criativo.
        </h1>
        <p className="text-muted text-sm">
          Brief baseado em padrões históricos que vencem.
        </p>
      </header>

      {!brief && !loading && (
        <div className="space-y-2 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            Sugestões
          </p>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setIntent(p);
                generate(p);
              }}
              className="block w-full text-left px-4 py-3 border border-border bg-surface text-sm text-ink hover:border-ink transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {loading && <LoadingTrail label="Reorganizando o relicário…" />}
        {error && (
          <div className="border-l-2 border-accent bg-accent-soft/30 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">
              Caímos numa armadilha
            </p>
            <p className="text-sm text-ink mb-1">
              O templo segue de pé — tenta de novo.
            </p>
            <p className="text-xs text-muted">{error}</p>
          </div>
        )}
        {brief && <BriefCard brief={brief} />}
      </div>

      <div className="mt-10 sticky bottom-6 border border-border bg-surface focus-within:border-ink transition-colors">
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          rows={2}
          disabled={loading}
          placeholder="Preciso criar 2 anúncios sobre crédito consignado. Indica-me a estrutura de cada um e quais elementos incluirmos em cada um."
          className="w-full p-4 bg-transparent resize-none focus:outline-none text-ink placeholder:text-muted/70"
        />
        <div className="px-4 py-2 border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
            {loading ? "Lendo padrões…" : "Studio · padrões históricos + mercado"}
          </span>
          <button
            onClick={submit}
            disabled={loading || !intent.trim()}
            className="px-3 py-1.5 text-sm bg-ink text-bg hover:bg-accent transition-colors disabled:bg-border disabled:text-muted"
          >
            Gerar brief
          </button>
        </div>
      </div>
    </div>
  );
}
