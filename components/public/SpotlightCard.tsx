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
    "mt-1 text-sm font-medium text-[color:var(--nsi-green)] hover:underline focus:outline-none focus:underline";

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
      <div className="nsi-band py-3 text-center text-sm font-bold text-white">
        Monthly Spotlights
      </div>
      <div className="grid md:grid-cols-3">
        {/* State Spotlight */}
        <div
          id="state-spotlight"
          className="flex flex-1 flex-col border-b border-black/5 p-6 scroll-mt-24 md:border-b-0 md:border-r md:border-black/5"
        >
          <div className="flex min-h-0 flex-1 items-start gap-4">
            <div className="shrink-0 overflow-hidden rounded-xl border border-black/5 p-2">
              <Image
                src="/spotlights/state-spotlight-logo.png"
                alt="State Spotlight"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  State Spotlight
                </h3>
                {showState ? (
                  <>
                    <p className="mt-3 font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
                      {safeString(stateSpot.state) || "State Spotlight"}
                    </p>
                    {stateKeyPointsHtml && (
                      <>
                        <div
                          className={`mt-4 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 ${!expandedState ? "line-clamp-4" : ""}`}
                        >
                          <SafeHtml html={stateKeyPointsHtml} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedState((e) => !e)}
                          className={readMoreClass}
                        >
                          {expandedState ? "Read less" : "Read more"}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-3 rounded-xl bg-[color:var(--nsi-paper-2)] p-6 text-center">
                    <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                      Coming in this month&apos;s report.
                    </p>
                  </div>
                )}
              </div>
              <Link
                href={stateHref}
                className="mt-auto inline-flex shrink-0 rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                {showState ? "Full spotlight" : "View spotlights"}
              </Link>
            </div>
          </div>
        </div>

        {/* Institution Spotlight */}
        <div
          id="institution-spotlight"
          className="flex flex-1 flex-col border-b border-black/5 p-6 scroll-mt-24 md:border-b-0 md:border-r md:border-black/5"
        >
          <div className="flex min-h-0 flex-1 items-start gap-4">
            <div className="shrink-0 overflow-hidden rounded-xl border border-black/5 p-2">
              <Image
                src="/spotlights/institution-spotlight-logo.png"
                alt="Institution Spotlight"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  Institution Spotlight
                </h3>
                {showInst ? (
                  <>
                    <p className="mt-3 font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
                      {safeString(instSpot.institution) || "Institution Spotlight"}
                    </p>
                    {(instSpot.summary || instKeyPointsHtml) && (
                      <>
                        <div
                          className={`mt-3 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 ${!expandedInst ? "line-clamp-4" : ""}`}
                        >
                          {instSpot.summary && <p className="mb-2">{instSpot.summary}</p>}
                          {instKeyPointsHtml && (
                            <SafeHtml html={instKeyPointsHtml} />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedInst((e) => !e)}
                          className={readMoreClass}
                        >
                          {expandedInst ? "Read less" : "Read more"}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-3 rounded-xl bg-[color:var(--nsi-paper-2)] p-6 text-center">
                    <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                      To be published with the snapshot.
                    </p>
                  </div>
                )}
              </div>
              <Link
                href={instHref}
                className="mt-auto inline-flex shrink-0 rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                {showInst ? "Full spotlight" : "View spotlights"}
              </Link>
            </div>
          </div>
        </div>

        {/* On-Ground Street Pulse */}
        <div
          id="street-pulse-spotlight"
          className="flex flex-1 flex-col p-6 scroll-mt-24"
        >
          <div className="flex min-h-0 flex-1 items-start gap-4">
            <div className="shrink-0 overflow-hidden rounded-xl border border-black/5 p-2 bg-amber-500/5">
              <div className="flex h-14 w-14 items-center justify-center text-amber-600">
                <PulseIcon className="h-7 w-7" />
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                  On-Ground Street Pulse
                </h3>
                {showStreetPulse ? (
                  <>
                    <p className="mt-3 font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
                      {safeString(streetPulseSpot?.title) || "Street Pulse"}
                    </p>
                    {(streetPulseSpot?.summary || streetPulseKeyPointsHtml) && (
                      <>
                        <div
                          className={`mt-2 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 ${!expandedStreetPulse ? "line-clamp-4" : ""}`}
                        >
                          {streetPulseSpot?.summary && (
                            <p className="mb-2">{streetPulseSpot.summary}</p>
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
                          {expandedStreetPulse ? "Read less" : "Read more"}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-3 rounded-xl bg-[color:var(--nsi-paper-2)] p-6 text-center">
                    <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                      Coming in this month&apos;s report.
                    </p>
                  </div>
                )}
              </div>
              <Link
                href={streetPulseHref}
                className="mt-auto inline-flex shrink-0 rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                {showStreetPulse ? "Full spotlight" : "View spotlights"}
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
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}
