import type { ReactNode } from "react";

type Ground = "ivory" | "paper" | "emerald";

export function SectionWrapper({
  id,
  ground = "ivory",
  children,
  className = "",
}: {
  id?: string;
  ground?: Ground;
  children: ReactNode;
  className?: string;
}) {
  const bg =
    ground === "emerald"
      ? "bg-emerald-ink-grain text-ivory"
      : ground === "paper"
        ? "bg-paper-grain text-emerald-ink"
        : "bg-ivory text-emerald-ink";

  return (
    <section id={id} className={`relative w-full ${bg} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow text-center ${className}`}>{children}</p>;
}

export function DisplayTitle({
  children,
  className = "",
  inverse = false,
}: {
  children: ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <h2
      className={`font-display text-center text-4xl sm:text-5xl md:text-6xl leading-[1.05] ${
        inverse ? "text-ivory" : "text-emerald-ink"
      } ${className}`}
    >
      {children}
    </h2>
  );
}
