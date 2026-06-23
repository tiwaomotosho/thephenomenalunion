import seal from "@/assets/seal.png";

export function Seal({ className = "", size = 128 }: { className?: string; size?: number }) {
  return (
    <img
      src={seal}
      alt="Wax seal — fulfilled"
      width={size}
      height={size}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
