"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { getKeyPointsHtml } from "@/lib/spotlight";

export type StateSpotlight = { state?: string; score?: number; bullets?: string[]; keyPointsHtml?: string };
export type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
  keyPointsHtml?: string;
};
export type StreetPulseSpotlight = {
  title?: string;
  summary?: string;
  keyPointsHtml?: string;
};

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

export type SpotlightCardProps = {
  stateSpot: StateSpotlight;
  instSpot: InstitutionSpotlight;
  streetPulseSpot?: StreetPulseSpotlight;
  showState: boolean;
  showInst: boolean;
  showStreetPulse: boolean;
  reportHref: string | null;
};

export function SpotlightCard({
  stateSpot,
  instSpot,
  streetPulseSpot,
  showState,
  showInst,
  showStreetPulse,
  reportHref,
}: SpotlightCardProps) {
  const stateHref = reportHref ? `${reportHref}#state-spotlight` : "/spotlights";
  const instHref = reportHref ? `${reportHref}#institution-spotlight` : "/spotlights";
  const streetPulseHref = reportHref ? `${reportHref}#street-pulse-spotlight` : "/spotlights";

  const stateKeyPointsHtml = getKeyPointsHtml(stateSpot);
  const instKeyPointsHtml = getKeyPointsHtml(instSpot);
  const streetPulseKeyPointsHtml =
    streetPulseSpot && typeof streetPulseSpot.keyPointsHtml === "string"
      ? streetPulseSpot.keyPointsHtml
      : "";

  const [expandedState, setExpandedState] = useState(false);
  const [expandedInst, setExpandedInst] = useState(false);
  const [expandedStreetPulse, setExpandedStreetPulse] = useState(false);

  const readMoreClass =
    "mt-2 inline-block font-mono text-xs font-semibold text-[#00f59b] hover:text-[#fbbf24] transition-colors focus:outline-none";

  return (
    <div className="observatory-card overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00f59b]/20 bg-[#040e08]/90 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f59e0b]"></span>
            </span>
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-[#00f59b] uppercase">
            EMPIRICAL SPOTLIGHT DOSSIERS
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748b]">
          <span className="rounded bg-black/40 px-2 py-0.5 border border-white/5">TRI-LENS AUDIT</span>
          <span className="text-[#38bdf8]">STATE · INSTITUTION · STREET</span>
        </div>
      </div>

      <div className="grid divide-y divide-[#00f59b]/15 md:grid-cols-3 md:divide-y-0 md:divide-x">
        {/* State Spotlight */}
        <div
          id="state-spotlight"
          className="flex flex-1 flex-col p-6 lg:p-8 scroll-mt-24 transition-colors hover:bg-[#07190f]/40"
        >
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#38bdf8]">
                  STATE GEOGRAPHY
                </span>
                <span className="rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-2 py-0.5 font-mono text-[10px] text-[#38bdf8]">
                  SUB-NATIONAL
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#38bdf8]/30 bg-[#091a1f] p-2">
                  <Image
                    src="/spotlights/state-spotlight-logo.png"
                    alt="State Spotlight"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                    {safeString(stateSpot.state) || "Regional Federation"}
                  </h3>
                  <p className="font-mono text-[11px] text-[#94a3b8]">Local Authority Audit</p>
                </div>
              </div>

              {showState ? (
                <div className="mt-5">
                  {stateKeyPointsHtml ? (
                    <>
                      <div
                        className={`text-sm leading-relaxed text-[#94a3b8] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${!expandedState ? "line-clamp-4" : ""}`}
                      >
                        <SafeHtml html={stateKeyPointsHtml} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedState((e) => !e)}
                        className={readMoreClass}
                      >
                        {expandedState ? "[-] Less detail" : "[+] Read full field briefing"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-[#94a3b8]">
                      Comprehensive administrative pulse across state treasury, local security apparatus, and capital projects.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-5 text-center">
                  <p className="font-mono text-xs text-[#64748b]">
                    Field data synchronization in progress for current cycle.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-[#00f59b]/10">
              <Link
                href={stateHref}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-4 py-2.5 font-mono text-xs font-semibold text-[#38bdf8] transition-all hover:bg-[#38bdf8] hover:text-black hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              >
                {showState ? "OPEN STATE BRIEFING →" : "EXPLORE ARCHIVE →"}
              </Link>
            </div>
          </div>
        </div>

        {/* Institution Spotlight */}
        <div
          id="institution-spotlight"
          className="flex flex-1 flex-col p-6 lg:p-8 scroll-mt-24 transition-colors hover:bg-[#07190f]/40"
        >
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#00f59b]">
                  GOVERNANCE APPARATUS
                </span>
                <span className="rounded-full border border-[#00f59b]/30 bg-[#00f59b]/10 px-2 py-0.5 font-mono text-[10px] text-[#00f59b]">
                  INSTITUTIONAL
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#00f59b]/30 bg-[#07190f] p-2">
                  <Image
                    src="/spotlights/institution-spotlight-logo.png"
                    alt="Institution Spotlight"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                    {safeString(instSpot.institution) || "Federal Regulator"}
                  </h3>
                  <p className="font-mono text-[11px] text-[#94a3b8]">Policy & Enforcement Review</p>
                </div>
              </div>

              {showInst ? (
                <div className="mt-5">
                  {(instSpot.summary || instKeyPointsHtml) ? (
                    <>
                      <div
                        className={`text-sm leading-relaxed text-[#94a3b8] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${!expandedInst ? "line-clamp-4" : ""}`}
                      >
                        {instSpot.summary && <p className="mb-2 text-slate-200">{instSpot.summary}</p>}
                        {instKeyPointsHtml && (
                          <SafeHtml html={instKeyPointsHtml} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedInst((e) => !e)}
                        className={readMoreClass}
                      >
                        {expandedInst ? "[-] Less detail" : "[+] Read institutional audit"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-[#94a3b8]">
                      Evaluating regulatory transparency, accountability mechanisms, and policy predictability.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-5 text-center">
                  <p className="font-mono text-xs text-[#64748b]">
                    To be published with the monthly synthesis.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-[#00f59b]/10">
              <Link
                href={instHref}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#00f59b]/40 bg-[#00f59b]/10 px-4 py-2.5 font-mono text-xs font-semibold text-[#00f59b] transition-all hover:bg-[#00f59b] hover:text-[#030805] hover:shadow-[0_0_15px_rgba(0,245,155,0.4)]"
              >
                {showInst ? "OPEN INSTITUTION AUDIT →" : "VIEW SPOTLIGHTS →"}
              </Link>
            </div>
          </div>
        </div>

        {/* On-Ground Street Pulse */}
        <div
          id="street-pulse-spotlight"
          className="flex flex-1 flex-col p-6 lg:p-8 scroll-mt-24 transition-colors hover:bg-[#07190f]/40"
        >
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#f59e0b]">
                  CITIZEN TELEMETRY
                </span>
                <span className="rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-0.5 font-mono text-[10px] text-[#f59e0b]">
                  GROUND VOICES
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#f59e0b]/30 bg-[#1f1509] p-2 text-[#f59e0b]">
                  <PulseIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                    {safeString(streetPulseSpot?.title) || "Grassroots Pulse"}
                  </h3>
                  <p className="font-mono text-[11px] text-[#94a3b8]">Everyday Nigerian Realities</p>
                </div>
              </div>

              {showStreetPulse ? (
                <div className="mt-5">
                  {(streetPulseSpot?.summary || streetPulseKeyPointsHtml) ? (
                    <>
                      <div
                        className={`text-sm leading-relaxed text-[#94a3b8] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${!expandedStreetPulse ? "line-clamp-4" : ""}`}
                      >
                        {streetPulseSpot?.summary && (
                          <p className="mb-2 italic text-[#fbbf24]">&ldquo;{streetPulseSpot.summary}&rdquo;</p>
                        )}
                        {streetPulseKeyPointsHtml && (
                          <SafeHtml html={streetPulseKeyPointsHtml} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedStreetPulse((e) => !e)}
                        className={readMoreClass}
                      >
                        {expandedStreetPulse ? "[-] Less detail" : "[+] Read verbatim feedback"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-[#94a3b8]">
                      Grassroots economic sentiment, transport tariffs, and kitchen-table stability indicators.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-5 text-center">
                  <p className="font-mono text-xs text-[#64748b]">
                    Community reports compiling across urban centers and rural LGAs.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-[#00f59b]/10">
              <Link
                href={streetPulseHref}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-2.5 font-mono text-xs font-semibold text-[#f59e0b] transition-all hover:bg-[#f59e0b] hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                {showStreetPulse ? "EXPLORE STREET VOICES →" : "SURVEY ARCHIVE →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
