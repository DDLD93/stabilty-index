import * as React from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function SemiGauge({
  value,
  min = 0,
  max = 10,
  size = 180,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  label?: string;
}) {
  const v = clamp(value, min, max);
  const t = (v - min) / (max - min); // 0..1
  const angle = -90 + 180 * t;

  const r = 70;
  const cx = 90;
  const cy = 90;

  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  // Unique ID for this gauge instance
  const gradientId = React.useId();

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={(size * 0.6) | 0}
        viewBox="0 0 180 110"
        role="img"
        aria-label={label ?? "Gauge"}
      >
        <defs>
          {/* Red-Orange-Yellow-Green gradient matching mockup */}
          <linearGradient id={`nsiGaugeGrad-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d35400" />
            <stop offset="25%" stopColor="#e67e22" />
            <stop offset="50%" stopColor="#f1c40f" />
            <stop offset="75%" stopColor="#82c341" />
            <stop offset="100%" stopColor="#27ae60" />
          </linearGradient>
          <filter id={`nsiGaugeShadow-${gradientId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="oklch(0.16 0.02 160 / 0.35)" />
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d="M20 90a70 70 0 0 1 140 0"
          fill="none"
          stroke="oklch(0.22 0.01 260 / 0.12)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Colored gradient arc */}
        <path
          d="M20 90a70 70 0 0 1 140 0"
          fill="none"
          stroke={`url(#nsiGaugeGrad-${gradientId})`}
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const tickAngle = -90 + 180 * t;
          const tickRad = (tickAngle * Math.PI) / 180;
          const innerR = 54;
          const outerR = 62;
          const x1 = cx + innerR * Math.cos(tickRad);
          const y1 = cy + innerR * Math.sin(tickRad);
          const x2 = cx + outerR * Math.cos(tickRad);
          const y2 = cy + outerR * Math.sin(tickRad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="oklch(0.3 0.01 260 / 0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <g filter={`url(#nsiGaugeShadow-${gradientId})`}>
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="oklch(0.18 0.01 260)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="8" fill="oklch(0.18 0.01 260)" />
          <circle cx={cx} cy={cy} r="4" fill="oklch(1 0 0)" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}

