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

  return (
    <div className="w-full" role="img" aria-label={label ?? `Gauge showing ${v}`}>
      {/* Value display */}
      {showValue && (
        <div className="mb-3 flex items-baseline justify-end gap-1">
          <span className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
            {v.toFixed(1)}
          </span>
          <span className="text-lg text-black/50">/10</span>
        </div>
      )}

      {/* Ruler container */}
      <div className="relative">
        {/* Background ruler */}
        <div className="nsi-ruler relative h-10 w-full overflow-hidden">
          {/* Tick marks */}
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {ticks.map((tick, idx) => {
              const isMajor = tick === min || tick === max || tick === 5;
              return (
                <div key={tick} className="flex flex-col items-center">
                  <div
                    className={`w-px ${isMajor ? "h-5 bg-black/40" : "h-3 bg-black/25"}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Filled portion */}
          <div
            className="absolute bottom-0 left-0 h-2 rounded-sm bg-[color:var(--nsi-green)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Marker/needle */}
        <div
          className="absolute -top-1 h-12 w-0.5 bg-[color:var(--nsi-green-ink)] transition-all duration-300"
          style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
        >
          {/* Triangle marker at top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div
              className="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[color:var(--nsi-green-ink)]"
            />
          </div>
        </div>

        {/* Number labels */}
        <div className="mt-2 flex justify-between px-1 text-[10px] text-black/50">
          {ticks.map((tick) => (
            <span key={tick} className="w-4 text-center">
              {tick}
            </span>
          ))}
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
      {/* Ruler background */}
      <rect
        x={padding}
        y={20}
        width={rulerWidth}
        height={16}
        rx={3}
        fill="oklch(0.96 0.01 88)"
        stroke="oklch(0.3 0.01 260 / 0.15)"
        strokeWidth={1}
      />

      {/* Filled portion */}
      <rect
        x={padding}
        y={28}
        width={rulerWidth * percentage}
        height={6}
        rx={2}
        fill="var(--nsi-green)"
      />

      {/* Tick marks */}
      {ticks.map((tick, idx) => {
        const x = padding + (rulerWidth / (max - min)) * idx;
        const isMajor = tick === min || tick === max || tick === 5;
        return (
          <g key={tick}>
            <line
              x1={x}
              y1={20}
              x2={x}
              y2={isMajor ? 32 : 28}
              stroke="oklch(0.3 0.01 260 / 0.4)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={height - 4}
              textAnchor="middle"
              fontSize={9}
              fill="oklch(0.3 0.01 260 / 0.5)"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Marker */}
      <g>
        <line
          x1={markerX}
          y1={8}
          x2={markerX}
          y2={38}
          stroke="var(--nsi-green-ink)"
          strokeWidth={2}
        />
        <polygon
          points={`${markerX - 5},4 ${markerX + 5},4 ${markerX},12`}
          fill="var(--nsi-green-ink)"
        />
      </g>
    </svg>
  );
}
