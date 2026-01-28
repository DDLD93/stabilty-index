"use client";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ScoreRing({
  value,
  min = 1,
  max = 10,
  size = 80,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  label?: string;
}) {
  const v = clamp(value, min, max);
  const t = (v - min) / (max - min);
  const strokeWidth = Math.max(4, size * 0.12);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - t);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={label ?? `Score ${v} out of ${max}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.92 0.01 88)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--nsi-green)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="mt-1 text-[0.8125rem] font-bold text-[color:var(--nsi-green)]">
        {v.toFixed(1)}
      </span>
    </div>
  );
}
