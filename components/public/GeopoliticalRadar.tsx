"use client";

import React, { useState } from "react";
import Link from "next/link";

type ZoneData = {
  id: string;
  name: string;
  code: string;
  score: number;
  delta: string;
  trend: "up" | "down" | "stable";
  states: string[];
  keyVector: string;
  primaryRisk: string;
  economicPulse: string;
  sentiment: string;
};

const ZONES: ZoneData[] = [
  {
    id: "nc",
    name: "North Central",
    code: "ZONE 01 / NC",
    score: 6.4,
    delta: "+0.3",
    trend: "up",
    states: ["FCT Abuja", "Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau"],
    keyVector: "Agricultural recovery & agro-allied supply routes expanding",
    primaryRisk: "Periodic seasonal clashes along pastoral corridors",
    economicPulse: "Moderate-High (Food hub trade resilience)",
    sentiment: "Resilient / Expectant",
  },
  {
    id: "ne",
    name: "North East",
    code: "ZONE 02 / NE",
    score: 5.7,
    delta: "+0.1",
    trend: "up",
    states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
    keyVector: "Ongoing civic reintegration, cross-border commerce reviving",
    primaryRisk: "Asymmetric border security surveillance requirements",
    economicPulse: "Stabilizing (Lake Chad basin transit flows)",
    sentiment: "Hopeful / Vigilant",
  },
  {
    id: "nw",
    name: "North West",
    code: "ZONE 03 / NW",
    score: 5.3,
    delta: "-0.2",
    trend: "down",
    states: ["Kaduna", "Kano", "Katsina", "Kebbi", "Jigawa", "Sokoto", "Zamfara"],
    keyVector: "Kano commercial node expansion; mining formalization underway",
    primaryRisk: "Rural banditry and agricultural logistics bottlenecks",
    economicPulse: "High Volume / High Friction",
    sentiment: "Tense / Determined",
  },
  {
    id: "sw",
    name: "South West",
    code: "ZONE 04 / SW",
    score: 7.6,
    delta: "+0.4",
    trend: "up",
    states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
    keyVector: "Tech/Fintech capital inflow, Lekki industrial corridor, port logistics",
    primaryRisk: "Cost of living pressures & infrastructure density overload",
    economicPulse: "Very High (40%+ of national non-oil revenue)",
    sentiment: "Pragmatic / Dynamic",
  },
  {
    id: "se",
    name: "South East",
    code: "ZONE 05 / SE",
    score: 6.1,
    delta: "+0.2",
    trend: "up",
    states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    keyVector: "Aba industrial revival, manufacturing clusters & SME supply chains",
    primaryRisk: "Residual non-state sit-at-home enforcement disruptions",
    economicPulse: "High Industrial / Commercial Dynamism",
    sentiment: "Productive / Cautious",
  },
  {
    id: "ss",
    name: "South South",
    code: "ZONE 06 / SS",
    score: 6.9,
    delta: "+0.3",
    trend: "up",
    states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    keyVector: "Hydrocarbon output stability, deep seaport developments, coastal infrastructure",
    primaryRisk: "Environmental remediation and youth employment absorption",
    economicPulse: "High (Federal fiscal redistribution base)",
    sentiment: "Steady / Demanding",
  },
];

export function GeopoliticalRadar() {
  const [selectedZone, setSelectedZone] = useState<ZoneData>(ZONES[3]); // Default South West or North Central

  return (
    <div className="observatory-card overflow-hidden p-6 sm:p-8 lg:p-10">
      {/* Header telemetry line */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(0,245,155,0.15)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f59b] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00f59b]" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#00f59b]">
              Geopolitical Radar Matrix
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Sub-National Stability Telemetry
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-md border border-[rgba(0,245,155,0.2)] bg-[rgba(0,245,155,0.05)] px-3 py-1 font-mono text-xs text-[#cbd5e1]">
            Active Region: <strong className="text-[#00f59b]">{selectedZone.name}</strong>
          </span>
          <span className="font-mono text-xs text-[#64748b]">
            36 States &amp; FCT
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Telemetry Readout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Interactive Map Hologram & Zone Selector (7 Cols) */}
        <div className="lg:col-span-7">
          {/* Zone Selector Pills */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[#00f59b] bg-[rgba(0,245,155,0.12)] shadow-[0_0_16px_rgba(0,245,155,0.2)]"
                      : "border-[rgba(0,245,155,0.1)] bg-[#07130c]/70 hover:border-[rgba(0,245,155,0.25)] hover:bg-[#07130c]"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#64748b]">
                      {zone.code.split("/")[1]}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        zone.score >= 7.0
                          ? "text-[#00f59b]"
                          : zone.score >= 6.0
                          ? "text-[#fbbf24]"
                          : "text-[#f43f5e]"
                      }`}
                    >
                      {zone.score.toFixed(1)}
                    </span>
                  </div>
                  <span className="mt-1 text-xs font-bold text-white">
                    {zone.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Holographic Interactive Radar Canvas */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[rgba(0,245,155,0.2)] bg-[#030a05] p-4 shadow-inner">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,155,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,155,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

            {/* Radar Scanline Rotation */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full border border-[rgba(0,245,155,0.15)] opacity-50" />
              <div className="absolute h-96 w-96 rounded-full border border-[rgba(0,245,155,0.08)] opacity-30" />
              <div
                className="absolute h-48 w-48 origin-bottom-right animate-spin rounded-tl-full border-r border-t border-[rgba(0,245,155,0.4)] bg-gradient-to-br from-[rgba(0,245,155,0.15)] to-transparent"
                style={{ animationDuration: "8s" }}
              />
            </div>

            {/* SVG Interactive Map with Zones */}
            <svg
              viewBox="0 0 400 300"
              className="relative z-10 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Nigeria Perimeter Outline */}
              <path
                d="M50 96 C42 72 58 52 80 42 C104 32 128 48 150 36 C172 24 194 18 218 24 C248 30 274 54 300 70 C322 82 350 100 346 128 C342 156 318 174 300 196 C282 214 276 242 252 254 C228 266 210 256 190 272 C172 288 148 296 126 284 C104 272 98 246 80 234 C62 222 40 218 34 196 C28 174 40 156 44 136 C46 118 52 102 50 96 Z"
                fill="rgba(0, 245, 155, 0.04)"
                stroke="#00f59b"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="6 3"
              />

              {/* Zone Highlight Shapes & Node Dots */}
              {/* North West */}
              <g
                onClick={() => setSelectedZone(ZONES[2])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="120"
                  cy="90"
                  r={selectedZone.id === "nw" ? "22" : "15"}
                  fill={selectedZone.id === "nw" ? "rgba(244, 63, 94, 0.25)" : "rgba(244, 63, 94, 0.1)"}
                  stroke="#f43f5e"
                  strokeWidth={selectedZone.id === "nw" ? "2" : "1"}
                />
                <circle cx="120" cy="90" r="4" fill="#f43f5e" />
                <text x="120" y="118" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#f8fafc">
                  NW · {ZONES[2].score}
                </text>
              </g>

              {/* North East */}
              <g
                onClick={() => setSelectedZone(ZONES[1])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="250"
                  cy="95"
                  r={selectedZone.id === "ne" ? "22" : "15"}
                  fill={selectedZone.id === "ne" ? "rgba(245, 158, 11, 0.25)" : "rgba(245, 158, 11, 0.1)"}
                  stroke="#f59e0b"
                  strokeWidth={selectedZone.id === "ne" ? "2" : "1"}
                />
                <circle cx="250" cy="95" r="4" fill="#f59e0b" />
                <text x="250" y="122" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#f8fafc">
                  NE · {ZONES[1].score}
                </text>
              </g>

              {/* North Central (Abia/FCT) */}
              <g
                onClick={() => setSelectedZone(ZONES[0])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="180"
                  cy="150"
                  r={selectedZone.id === "nc" ? "24" : "16"}
                  fill={selectedZone.id === "nc" ? "rgba(0, 245, 155, 0.25)" : "rgba(0, 245, 155, 0.1)"}
                  stroke="#00f59b"
                  strokeWidth={selectedZone.id === "nc" ? "2.5" : "1"}
                />
                <circle cx="180" cy="150" r="5" fill="#00f59b" />
                <text x="180" y="178" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#00f59b">
                  NC (FCT) · {ZONES[0].score}
                </text>
              </g>

              {/* South West */}
              <g
                onClick={() => setSelectedZone(ZONES[3])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="90"
                  cy="200"
                  r={selectedZone.id === "sw" ? "24" : "16"}
                  fill={selectedZone.id === "sw" ? "rgba(0, 245, 155, 0.3)" : "rgba(0, 245, 155, 0.12)"}
                  stroke="#00f59b"
                  strokeWidth={selectedZone.id === "sw" ? "2.5" : "1"}
                />
                <circle cx="90" cy="200" r="5" fill="#00f59b" />
                <text x="90" y="228" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#00f59b">
                  SW (LAGOS) · {ZONES[3].score}
                </text>
              </g>

              {/* South East */}
              <g
                onClick={() => setSelectedZone(ZONES[4])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="185"
                  cy="225"
                  r={selectedZone.id === "se" ? "20" : "14"}
                  fill={selectedZone.id === "se" ? "rgba(56, 189, 248, 0.25)" : "rgba(56, 189, 248, 0.1)"}
                  stroke="#38bdf8"
                  strokeWidth={selectedZone.id === "se" ? "2" : "1"}
                />
                <circle cx="185" cy="225" r="4" fill="#38bdf8" />
                <text x="185" y="248" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#38bdf8">
                  SE · {ZONES[4].score}
                </text>
              </g>

              {/* South South */}
              <g
                onClick={() => setSelectedZone(ZONES[5])}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx="140"
                  cy="245"
                  r={selectedZone.id === "ss" ? "22" : "15"}
                  fill={selectedZone.id === "ss" ? "rgba(251, 191, 36, 0.25)" : "rgba(251, 191, 36, 0.1)"}
                  stroke="#fbbf24"
                  strokeWidth={selectedZone.id === "ss" ? "2" : "1"}
                />
                <circle cx="140" cy="245" r="4" fill="#fbbf24" />
                <text x="140" y="268" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill="#fbbf24">
                  SS · {ZONES[5].score}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Column: Deep Telemetry Intelligence Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl border border-[rgba(0,245,155,0.25)] bg-[#07130c] p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#64748b]">
                  {selectedZone.code}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                  {selectedZone.name}
                </h3>
              </div>

              {/* Giant Index Dial */}
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="font-serif text-4xl font-bold text-[#00f59b]">
                    {selectedZone.score.toFixed(1)}
                  </span>
                  <span className="font-mono text-sm text-[#64748b]">/10</span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#00f59b]">
                  {selectedZone.delta} Mo/Mo
                </span>
              </div>
            </div>

            {/* States in Zone */}
            <div className="mt-4 border-t border-[rgba(0,245,155,0.15)] pt-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                Federating States Included:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedZone.states.map((st) => (
                  <span
                    key={st}
                    className="rounded-md border border-[rgba(0,245,155,0.2)] bg-[rgba(0,245,155,0.06)] px-2.5 py-1 font-mono text-[11px] font-medium text-[#cbd5e1]"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Telemetry Metrics List */}
            <div className="mt-6 space-y-3.5 border-t border-[rgba(0,245,155,0.15)] pt-5 text-sm">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                  Primary Stability Vector
                </span>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#f8fafc]">
                  {selectedZone.keyVector}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#f43f5e]">
                  Vulnerability / Friction Factor
                </span>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#cbd5e1]">
                  {selectedZone.primaryRisk}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-[rgba(0,245,155,0.1)] bg-[#030805] p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#64748b]">
                    Economic Velocity
                  </span>
                  <p className="mt-0.5 font-mono text-xs font-bold text-[#fbbf24]">
                    {selectedZone.economicPulse}
                  </p>
                </div>

                <div className="rounded-lg border border-[rgba(0,245,155,0.1)] bg-[#030805] p-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#64748b]">
                    Citizen Pulse
                  </span>
                  <p className="mt-0.5 font-mono text-xs font-bold text-[#00f59b]">
                    {selectedZone.sentiment}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(0,245,155,0.15)]">
              <Link
                href="/spotlights"
                className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#00f59b] hover:text-white transition-colors"
              >
                <span>Full Regional Dossier &amp; Historical Trajectory</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
