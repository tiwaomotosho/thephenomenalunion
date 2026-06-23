import crestGold from "@/assets/crest-gold.png";

export function Crest({ className = "", size = 160 }: { className?: string; size?: number }) {
  return (
    <img
      src={crestGold}
      alt="House cipher of Eniolaoluwa & Tiwalade — Amor Vincit Omnia"
      width={size}
      height={size}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
