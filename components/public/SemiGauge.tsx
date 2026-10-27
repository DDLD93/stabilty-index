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
  const t = (v - min) / (max - min);
  const angle = -90 + 180 * t;

  const r = 68;
  const cx = 90;
  const cy = 88;

  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  const gradientId = React.useId();

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={(size * 0.6) | 0}
        viewBox="0 0 180 108"
        role="img"
        aria-label={label ?? "Public Sentiment Gauge"}
      >
        <defs>
          <linearGradient id={`nsiGaugeGrad-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b84a27" />
            <stop offset="45%" stopColor="#c88a2b" />
            <stop offset="75%" stopColor="#1d7a4c" />
            <stop offset="100%" stopColor="#0b3b24" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d="M22 88a68 68 0 0 1 136 0"
          fill="none"
          stroke="#ece8df"
          strokeWidth="14"
          strokeLinecap="butt"
        />
        {/* Active gradient arc */}
        <path
          d="M22 88a68 68 0 0 1 136 0"
          fill="none"
          stroke={`url(#nsiGaugeGrad-${gradientId})`}
          strokeWidth="10"
          strokeLinecap="butt"
        />

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const tickAngle = -90 + 180 * tick;
          const tickRad = (tickAngle * Math.PI) / 180;
          const innerR = 52;
          const outerR = 60;
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
              stroke="#111613"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Needle */}
        <g>
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#111613"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="6" fill="#0b3b24" stroke="#c88a2b" strokeWidth="2" />
        </g>

        {/* Scale end labels */}
        <text x="18" y="102" fontSize="8" fontFamily="monospace" fill="#6c7770">0.0</text>
        <text x="84" y="12" fontSize="8" fontFamily="monospace" fill="#6c7770">5.0</text>
        <text x="150" y="102" fontSize="8" fontFamily="monospace" fill="#6c7770">10.0</text>
      </svg>
    </div>
  );
}
