import cipher from "@/assets/cipher-gold.png";

export function Cipher({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <img
      src={cipher}
      alt="E & T cipher"
      width={size}
      height={Math.round(size * 1.5)}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
