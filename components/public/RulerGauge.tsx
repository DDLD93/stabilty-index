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
        <div className="mb-4 flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00f59b]">
            Empirical Composite Score
          </span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-4xl font-extrabold tracking-tight text-[#00f59b] drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">
              {v.toFixed(1)}
            </span>
            <span className="text-lg text-slate-500">/ 10</span>
          </div>
        </div>
      )}

      {/* Ruler container */}
      <div className="relative">
        {/* Background ruler */}
        <div className="relative h-12 w-full overflow-hidden rounded-xl border border-[#00f59b]/25 bg-[#030d07] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
          {/* Tick marks */}
          <div className="absolute inset-0 flex items-center justify-between px-3">
            {ticks.map((tick) => {
              const isMajor = tick === min || tick === max || tick === 5;
              return (
                <div key={tick} className="flex flex-col items-center">
                  <div
                    className={`w-[1.5px] ${isMajor ? "h-6 bg-[#00f59b]/60" : "h-3.5 bg-slate-700/60"}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Filled portion */}
          <div
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-[#00f59b]/40 via-[#00f59b] to-[#fbbf24] shadow-[0_0_12px_rgba(0,245,155,0.7)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Marker/needle */}
        <div
          className="absolute -top-1.5 h-15 w-[3px] rounded-full bg-[#fbbf24] transition-all duration-500 shadow-[0_0_10px_#fbbf24]"
          style={{ 
            left: `${percentage}%`, 
            transform: "translateX(-50%)",
          }}
        >
          {/* Marker head */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="h-3 w-3 rotate-45 border border-[#fbbf24] bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
          </div>
        </div>

        {/* Number labels */}
        <div className="mt-3 flex justify-between px-2 font-mono text-[10px] font-semibold text-slate-400">
          {ticks.map((tick) => (
            <span key={tick} className={`w-4 text-center ${tick === Math.round(v) ? "text-[#00f59b] font-bold" : ""}`}>
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
      className="overflow-visible"
    >
      {/* Ruler background */}
      <rect
        x={padding}
        y={18}
        width={rulerWidth}
        height={18}
        rx={4}
        fill="#041108"
        stroke="rgba(0, 245, 155, 0.3)"
        strokeWidth={1}
      />

      {/* Filled portion */}
      <rect
        x={padding}
        y={28}
        width={rulerWidth * percentage}
        height={6}
        rx={2}
        fill="#00f59b"
      />

      {/* Tick marks */}
      {ticks.map((tick, idx) => {
        const x = padding + (rulerWidth / (max - min)) * idx;
        const isMajor = tick === min || tick === max || tick === 5;
        return (
          <g key={tick}>
            <line
              x1={x}
              y1={18}
              x2={x}
              y2={isMajor ? 30 : 25}
              stroke={isMajor ? "rgba(0, 245, 155, 0.7)" : "rgba(100, 116, 139, 0.6)"}
              strokeWidth={1}
            />
            <text
              x={x}
              y={height - 2}
              textAnchor="middle"
              fontSize={8.5}
              fontFamily="monospace"
              fill={tick === Math.round(v) ? "#00f59b" : "rgba(148, 163, 184, 0.7)"}
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
          y1={6}
          x2={markerX}
          y2={38}
          stroke="#f59e0b"
          strokeWidth={2}
        />
        <polygon
          points={`${markerX - 4},4 ${markerX + 4},4 ${markerX},10`}
          fill="#fbbf24"
        />
      </g>
    </svg>
  );
}
