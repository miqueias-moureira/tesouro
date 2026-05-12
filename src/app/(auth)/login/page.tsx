"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              R2 Ventures
            </span>
          </div>
          <h1 className="font-serif text-4xl text-ink mb-2">Tesouro</h1>
          <p className="text-sm text-muted italic">
            Onde está o próximo dólar.
          </p>
        </div>

        <button
          onClick={() => router.push("/jeitto")}
          className="w-full py-2.5 bg-ink text-bg hover:bg-accent transition-colors text-sm"
        >
          Entrar no demo · Jeitto
        </button>

        <p className="mt-8 text-center text-xs text-muted">
          Acesso restrito ao time de growth.
        </p>
      </div>
    </main>
  );
}
