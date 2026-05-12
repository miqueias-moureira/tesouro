"use client";

import { useParams } from "next/navigation";
import { useReview } from "@/presentation/hooks/use-review";
import { ReviewDocument } from "@/presentation/components/review/review-document";
import { LoadingTrail } from "@/presentation/components/chat/loading-trail";

export default function ReviewsPage() {
  const params = useParams<{ partner: string }>();
  const partnerName = params.partner.charAt(0).toUpperCase() + params.partner.slice(1);
  const { review, loading, error, generate } = useReview(params.partner);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14">
      {!review && !loading && (
        <>
          <header className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
              Reviews
            </p>
            <h1 className="font-serif text-3xl text-ink mb-1">
              Doc semanal pra parceiro.
            </h1>
            <p className="text-muted text-sm">
              Toda sexta às 10h, Tesouro gera o Media Review completo e publica
              no Notion da parceria.
            </p>
          </header>

          <div className="max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
              Próximo Review
            </p>
            <button
              onClick={() => generate("Semana 19 · 06–12/05")}
              className="w-full text-left px-5 py-5 border border-border bg-surface hover:border-ink transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">
                Semana 19 · 06–12/05
              </p>
              <p className="font-serif text-xl text-ink mb-1">
                Media Review · {partnerName}
              </p>
              <p className="text-sm text-muted">
              </p>
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="max-w-prose mx-auto">
          <LoadingTrail label="Compilando os achados da semana…" />
        </div>
      )}

      {error && (
        <div className="border-l-2 border-accent bg-accent-soft/30 px-4 py-3 max-w-prose mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">
            Caímos numa armadilha
          </p>
          <p className="text-sm text-ink mb-1">
            O templo segue de pé — tenta de novo.
          </p>
          <p className="text-xs text-muted">{error}</p>
        </div>
      )}

      {review && <ReviewDocument review={review} partnerName={partnerName} />}
    </div>
  );
}
