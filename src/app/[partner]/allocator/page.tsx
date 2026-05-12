"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInput } from "@/presentation/components/chat/chat-input";
import { RecommendationCard } from "@/presentation/components/chat/recommendation-card";
import { UserMessage } from "@/presentation/components/chat/user-message";
import { LoadingTrail } from "@/presentation/components/chat/loading-trail";
import { useTesouro } from "@/presentation/hooks/use-tesouro";

const SUGGESTIONS = [
  "Tenho uma limitação de budget de 150 mil para o final do mês, indica-me onde devo cortar orçamento?",
  "Por que o Search caiu de performance na semana passada?",
  "Vale a pena dobrar budget em Reels agora?",
];

export default function AllocatorPage() {
  const { turns, loading, ask } = useTesouro();
  const params = useSearchParams();
  const presetQuestion = params.get("q");
  const autoAsked = useRef(false);

  useEffect(() => {
    if (presetQuestion && !autoAsked.current) {
      autoAsked.current = true;
      ask(presetQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetQuestion]);

  const empty = turns.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
          Allocator
        </p>
        <h1 className="font-serif text-3xl text-ink mb-1">
          Onde investir o próximo R$?
        </h1>
        <p className="text-muted text-sm">
          Pergunte e o Master orquestra os especialistas em paralelo.
        </p>
      </header>

      {empty ? (
        <EmptyState onPick={ask} />
      ) : (
        <div className="space-y-10">
          {turns.map((t, i) => (
            <div key={i} className="space-y-5">
              <UserMessage text={t.question} />
              {t.recommendation ? (
                <RecommendationCard recommendation={t.recommendation} />
              ) : t.error ? (
                <ErrorBlock message={t.error} />
              ) : (
                <LoadingTrail label="Decifrando o hieróglifo…" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 sticky bottom-6">
        <ChatInput onSubmit={ask} loading={loading} />
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="space-y-2 mb-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
        O mapa ainda está em branco. Diga onde caçar.
      </p>
      <div className="h-px bg-border mb-3" />
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onPick(s)}
          className="block w-full text-left px-4 py-3 border border-border bg-surface text-sm text-ink hover:border-ink transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border-l-2 border-accent bg-accent-soft/30 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">
        Caímos numa armadilha
      </p>
      <p className="text-sm text-ink mb-1">
        O templo segue de pé — tenta de novo.
      </p>
      <p className="text-xs text-muted">{message}</p>
    </div>
  );
}
