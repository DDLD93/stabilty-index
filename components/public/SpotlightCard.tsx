"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { getKeyPointsHtml } from "@/lib/spotlight";
import {
  PillarGovernanceIcon,
  PillarSocialIcon,
} from "@/components/public/icons";

export type StateSpotlight = {
  state?: string;
  score?: number;
  bullets?: string[];
  keyPointsHtml?: string;
};
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
  const streetPulseHref = reportHref
    ? `${reportHref}#street-pulse-spotlight`
    : "/spotlights";

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
    "mt-2 inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-green)] hover:underline focus:outline-none";

  return (
    <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] bg-white shadow-sm">
      {/* Institutional Dossier Header Band */}
      <div className="nsi-band flex flex-col justify-between gap-2 px-6 py-4 text-white sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 bg-[color:var(--nsi-gold)]" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-white">
            Empirical Dossier · Monthly Spotlights
          </span>
        </div>
        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/65">
          Evidence-Based Highlights · Not Endorsements
        </span>
      </div>

      {/* 3-Column Ruled Grid (Chatham House / Afrobarometer style) */}
      <div className="grid divide-y divide-[color:var(--nsi-rule)] md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* Column 1: State Spotlight */}
        <div
          id="state-spotlight"
          className="flex flex-col justify-between p-6 scroll-mt-24 sm:p-8"
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[color:var(--nsi-rule)] pb-3">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-green)]">
                01 / Sub-National Focus
              </span>
              {showState && typeof stateSpot.score === "number" && (
                <span className="rounded-[2px] border border-[color:var(--nsi-green)]/25 bg-[color:var(--nsi-emerald-tint)] px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-[color:var(--nsi-green)]">
                  {stateSpot.score.toFixed(1)} / 10
                </span>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-green)]">
                <StateMapEmblem className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                  State Spotlight
                </div>
                <h3 className="mt-0.5 font-serif text-2xl font-bold leading-snug text-[color:var(--nsi-ink)]">
                  {showState
                    ? safeString(stateSpot.state) || "Featured State"
                    : "Pending Release"}
                </h3>
              </div>
            </div>

            {showState ? (
              stateKeyPointsHtml ? (
                <div className="mt-4">
                  <div
                    className={`text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${
                      !expandedState ? "line-clamp-4" : ""
                    }`}
                  >
                    <SafeHtml html={stateKeyPointsHtml} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedState((e) => !e)}
                    className={readMoreClass}
                  >
                    {expandedState ? "Collapse notes ↑" : "Expand notes ↓"}
                  </button>
                </div>
              ) : null
            ) : (
              <div className="mt-5 rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] p-5">
                <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                  Sub-national field data and state performance metrics will be
                  published in this cycle&apos;s snapshot.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-[color:var(--nsi-rule)] pt-4">
            <Link
              href={stateHref}
              className="inline-flex w-full items-center justify-between rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)] transition-colors hover:border-[color:var(--nsi-green)] hover:bg-[color:var(--nsi-green)] hover:text-white"
            >
              <span>{showState ? "Examine State Dossier" : "View Spotlights"}</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Column 2: Institution Spotlight */}
        <div
          id="institution-spotlight"
          className="flex flex-col justify-between p-6 scroll-mt-24 sm:p-8"
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[color:var(--nsi-rule)] pb-3">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-gold-deep)]">
                02 / Institutional Focus
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                Public Mandate
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-green)]">
                <PillarGovernanceIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                  Institution Spotlight
                </div>
                <h3 className="mt-0.5 font-serif text-2xl font-bold leading-snug text-[color:var(--nsi-ink)]">
                  {showInst
                    ? safeString(instSpot.institution) || "Featured Institution"
                    : "Pending Release"}
                </h3>
              </div>
            </div>

            {showInst ? (
              (instSpot.summary || instKeyPointsHtml) && (
                <div className="mt-4">
                  <div
                    className={`text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${
                      !expandedInst ? "line-clamp-4" : ""
                    }`}
                  >
                    {instSpot.summary && (
                      <p className="mb-2 font-medium text-[color:var(--nsi-ink)]">
                        {instSpot.summary}
                      </p>
                    )}
                    {instKeyPointsHtml && <SafeHtml html={instKeyPointsHtml} />}
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedInst((e) => !e)}
                    className={readMoreClass}
                  >
                    {expandedInst ? "Collapse notes ↑" : "Expand notes ↓"}
                  </button>
                </div>
              )
            ) : (
              <div className="mt-5 rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] p-5">
                <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                  Institutional governance and policy delivery analysis will be
                  published with the monthly snapshot.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-[color:var(--nsi-rule)] pt-4">
            <Link
              href={instHref}
              className="inline-flex w-full items-center justify-between rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)] transition-colors hover:border-[color:var(--nsi-green)] hover:bg-[color:var(--nsi-green)] hover:text-white"
            >
              <span>
                {showInst ? "Examine Institution Dossier" : "View Spotlights"}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Column 3: On-Ground Street Pulse */}
        <div
          id="street-pulse-spotlight"
          className="flex flex-col justify-between p-6 scroll-mt-24 sm:p-8"
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[color:var(--nsi-rule)] pb-3">
              <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--nsi-terracotta)]">
                03 / Citizen Field Pulse
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                Grassroots Signal
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] text-[color:var(--nsi-green)]">
                <PillarSocialIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--nsi-ink-muted)]">
                  On-Ground Street Pulse
                </div>
                <h3 className="mt-0.5 font-serif text-2xl font-bold leading-snug text-[color:var(--nsi-ink)]">
                  {showStreetPulse
                    ? safeString(streetPulseSpot?.title) || "Street Pulse"
                    : "Pending Release"}
                </h3>
              </div>
            </div>

            {showStreetPulse ? (
              (streetPulseSpot?.summary || streetPulseKeyPointsHtml) && (
                <div className="mt-4">
                  <div
                    className={`text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${
                      !expandedStreetPulse ? "line-clamp-4" : ""
                    }`}
                  >
                    {streetPulseSpot?.summary && (
                      <p className="mb-2 font-medium text-[color:var(--nsi-ink)]">
                        {streetPulseSpot.summary}
                      </p>
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
                    {expandedStreetPulse ? "Collapse notes ↑" : "Expand notes ↓"}
                  </button>
                </div>
              )
            ) : (
              <div className="mt-5 rounded-[3px] border border-[color:var(--nsi-rule)] bg-[color:var(--nsi-paper)] p-5">
                <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                  Direct market, transit, and household sentiment synthesis will
                  be published in this month&apos;s report.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-[color:var(--nsi-rule)] pt-4">
            <Link
              href={streetPulseHref}
              className="inline-flex w-full items-center justify-between rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)] transition-colors hover:border-[color:var(--nsi-green)] hover:bg-[color:var(--nsi-green)] hover:text-white"
            >
              <span>
                {showStreetPulse ? "Examine Field Pulse" : "View Spotlights"}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StateMapEmblem({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  );
}
