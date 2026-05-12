interface Props {
  text: string;
}

export function UserMessage({ text }: Props) {
  return (
    <div className="flex">
      <div className="max-w-full">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
          Pergunta
        </p>
        <p className="font-serif text-xl text-ink leading-snug">{text}</p>
      </div>
    </div>
  );
}
