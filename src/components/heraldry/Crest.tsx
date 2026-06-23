import crestGold from "@/assets/crest-gold.png";
import site from "@/content/site.json";

export function Crest({ className = "", size = 160 }: { className?: string; size?: number }) {
  return (
    <img
      src={crestGold}
      alt={`Family crest of ${site.bride.first} & ${site.groom.first} — ${site.motto}`}
      width={size}
      height={size}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
