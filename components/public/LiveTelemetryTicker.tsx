"use client";

import React from "react";
import Link from "next/link";

export function LiveTelemetryTicker() {
  const items = [
    { label: "OBSERVATORY STATUS", value: "ONLINE // HIGH RESILIENCE", highlight: "emerald" },
    { label: "GEO-SCOPE", value: "36 STATES & FCT ABUJA", highlight: "slate" },
    { label: "LATEST INDEX", value: "6.8 / 10.0 [▲ +0.2 DELTA]", highlight: "emerald" },
    { label: "SECURITY INDEX", value: "6.2/10 [STABILIZING]", highlight: "gold" },
    { label: "FX & ECONOMY", value: "5.9/10 [MARKET ADAPTATION]", highlight: "emerald" },
    { label: "INVESTOR SENTIMENT", value: "6.7/10 [CAPITAL INFLOW]", highlight: "cyan" },
    { label: "COORDINATES", value: "09°04′N 07°29′E (ABUJA HQ)", highlight: "slate" },
    { label: "REPORT CADENCE", value: "11TH MONTHLY SYNTHESIS", highlight: "gold" },
    { label: "PUBLIC PARTICIPATION", value: "OPEN (ZERO PII RECORDED)", highlight: "emerald" },
  ];

  return (
    <aside
      aria-label="Live Telemetry Tape"
      className="relative z-50 overflow-hidden border-b border-[rgba(0,245,155,0.15)] bg-[#030a05] py-1.5 font-mono text-[11px]"
    >
      <div className="flex items-center">
        {/* Fixed Indicator Badge */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-[rgba(0,245,155,0.2)] bg-[#030a05] px-4 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f59b] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f59b]" />
          </span>
          <span className="font-bold tracking-widest text-[#00f59b]">TELEMETRY LIVE</span>
        </div>

        {/* Scrolling Ticker Strip */}
        <div className="relative flex flex-1 overflow-hidden">
          <div className="animate-ticker flex items-center gap-8 pl-4">
            {[...items, ...items].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#64748b]">{item.label}:</span>
                <span
                  className={
                    item.highlight === "emerald"
                      ? "font-semibold text-[#00f59b]"
                      : item.highlight === "gold"
                      ? "font-semibold text-[#fbbf24]"
                      : item.highlight === "cyan"
                      ? "font-semibold text-[#38bdf8]"
                      : "text-[#cbd5e1]"
                  }
                >
                  {item.value}
                </span>
                <span className="text-[#334155]">/</span>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Action Anchor */}
        <div className="z-10 hidden shrink-0 items-center border-l border-[rgba(0,245,155,0.2)] bg-[#030a05] px-4 sm:flex">
          <Link
            href="/survey"
            className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#fbbf24] transition-colors hover:text-white"
          >
            <span>Transmit Field Reading</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
