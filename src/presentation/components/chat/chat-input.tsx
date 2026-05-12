"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  onSubmit: (question: string) => void;
  loading: boolean;
}

export function ChatInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");

  function submit() {
    const q = value.trim();
    if (!q || loading) return;
    onSubmit(q);
    setValue("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border border-border bg-surface focus-within:border-ink transition-colors">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={3}
        disabled={loading}
        placeholder="Onde investir os próximos R$ 50k em Jeitto hoje?"
        className="w-full p-4 bg-transparent resize-none focus:outline-none text-ink placeholder:text-muted/70"
      />
      <div className="px-4 py-2 border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
          {loading ? "Cruzando pistas…" : "Enter para enviar"}
        </span>
        <button
          onClick={submit}
          disabled={loading || !value.trim()}
          className={cn(
            "px-3 py-1.5 text-sm transition-colors",
            loading || !value.trim()
              ? "bg-border text-muted cursor-not-allowed"
              : "bg-ink text-bg hover:bg-accent"
          )}
        >
          {loading ? "…" : "Perguntar"}
        </button>
      </div>
    </div>
  );
}
