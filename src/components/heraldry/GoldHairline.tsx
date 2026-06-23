export function GoldHairline({
  wide = false,
  withCipher = false,
  className = "",
}: {
  wide?: boolean;
  withCipher?: boolean;
  className?: string;
}) {
  if (withCipher) {
    return (
      <div className={`flex items-center justify-center gap-4 my-10 ${className}`}>
        <span className={wide ? "gold-hairline-wide" : "gold-hairline"} aria-hidden />
        <span className="text-gold text-xs font-ceremonial">❖</span>
        <span className={wide ? "gold-hairline-wide" : "gold-hairline"} aria-hidden />
      </div>
    );
  }
  return <div className={`${wide ? "gold-hairline-wide" : "gold-hairline"} my-10 ${className}`} aria-hidden />;
}
