import { cn } from "@/lib/cn";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "px-3 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-ink text-bg hover:bg-accent",
        variant === "ghost" && "text-muted hover:text-ink",
        variant === "outline" &&
          "border border-border text-ink hover:border-ink",
        className
      )}
    />
  );
}
