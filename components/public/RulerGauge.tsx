import * as React from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function RulerGauge({
  value,
  min = 1,
  max = 10,
  label,
  showValue = true,
}: {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}) {
  const v = clamp(value, min, max);
  const percentage = ((v - min) / (max - min)) * 100;
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const getBandLabel = (score: number) => {
    if (score < 3.5) return "Critical Fragility (1.0–3.4)";
    if (score < 5.5) return "Elevated Strain (3.5–5.4)";
    if (score < 7.0) return "Cautiously Stable (5.5–6.9)";
    return "Resilient Trajectory (7.0–10.0)";
  };

  return (
    <div className="w-full" role="img" aria-label={label ?? `Stability gauge showing ${v} out of ${max}`}>
      {/* Header row with band classification */}
      <div className="mb-2.5 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-widest text-[color:var(--nsi-ink-soft)]">
          Band: <strong className="text-[color:var(--nsi-ink)]">{getBandLabel(v)}</strong>
        </span>
        {showValue && (
          <span className="font-mono text-xl font-bold tabular-nums text-[color:var(--nsi-green)]">
            {v.toFixed(1)} <span className="text-xs font-normal text-[color:var(--nsi-ink-muted)]">/ {max}.0</span>
          </span>
        )}
      </div>

      {/* Segmented Afrobarometer/BudgIT linear scale */}
      <div className="relative pt-3 pb-1">
        <div className="relative h-8 w-full overflow-hidden rounded-[2px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper-2)]">
          {/* Background zone bands */}
          <div className="absolute inset-0 flex">
            <div className="h-full w-[27.7%] border-r border-black/10 bg-[#b84a27]/12" title="1-3.5 Fragile" />
            <div className="h-full w-[22.2%] border-r border-black/10 bg-[#c88a2b]/15" title="3.5-5.5 Strained" />
            <div className="h-full w-[22.2%] border-r border-black/10 bg-[#1d7a4c]/12" title="5.5-7.5 Stable" />
            <div className="h-full flex-1 bg-[#0b3b24]/15" title="7.5-10 Resilient" />
          </div>

          {/* Active progress bar at bottom */}
          <div
            className="absolute bottom-0 left-0 h-2.5 bg-[color:var(--nsi-green)] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />

          {/* Precision tick marks */}
          <div className="absolute inset-0 flex items-start justify-between px-2">
            {ticks.map((tick) => {
              const isMajor = tick === min || tick === max || tick === 5;
              return (
                <div key={tick} className="flex flex-col items-center">
                  <div
                    className={`w-px ${isMajor ? "h-4 bg-[color:var(--nsi-ink)]/55" : "h-2.5 bg-[color:var(--nsi-ink)]/25"}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* High-contrast index needle */}
        <div
          className="absolute top-1 h-11 w-0.5 bg-[color:var(--nsi-ink)] transition-all duration-300"
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
            <div className="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[color:var(--nsi-gold)]" />
          </div>
        </div>

        {/* Scale labels */}
        <div className="mt-2 flex justify-between px-1 font-mono text-[0.6875rem] font-semibold tabular-nums text-[color:var(--nsi-ink-soft)]">
          {ticks.map((tick) => (
            <span key={tick} className="w-4 text-center">
              {tick}
            </span>
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.625rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
          <span>Acute Instability</span>
          <span>Moderate / Cautious</span>
          <span>High Stability</span>
        </div>
      </div>
    </div>
  );
}

export function RulerGaugeSVG({
  value,
  min = 1,
  max = 10,
  width = 280,
  height = 60,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  label?: string;
}) {
  const v = clamp(value, min, max);
  const padding = 20;
  const rulerWidth = width - padding * 2;
  const percentage = (v - min) / (max - min);
  const markerX = padding + rulerWidth * percentage;
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? `Gauge showing ${v}`}
    >
      <rect
        x={padding}
        y={20}
        width={rulerWidth}
        height={16}
        rx={2}
        fill="#ece8df"
        stroke="#111613"
        strokeOpacity="0.2"
        strokeWidth={1}
      />
      <rect
        x={padding}
        y={29}
        width={rulerWidth * percentage}
        height={7}
        rx={1}
        fill="#0b3b24"
      />
      {ticks.map((tick, idx) => {
        const x = padding + (rulerWidth / (max - min)) * idx;
        const isMajor = tick === min || tick === max || tick === 5;
        return (
          <g key={tick}>
            <line
              x1={x}
              y1={20}
              x2={x}
              y2={isMajor ? 30 : 26}
              stroke="#111613"
              strokeOpacity="0.45"
              strokeWidth={1}
            />
            <text
              x={x}
              y={height - 4}
              textAnchor="middle"
              fontSize={9}
              fontFamily="monospace"
              fill="#434d47"
            >
              {tick}
            </text>
          </g>
        );
      })}
      <g>
        <line
          x1={markerX}
          y1={8}
          x2={markerX}
          y2={38}
          stroke="#111613"
          strokeWidth={2}
        />
        <polygon
          points={`${markerX - 5},4 ${markerX + 5},4 ${markerX},12`}
          fill="#c88a2b"
        />
      </g>
    </svg>
  );
}
