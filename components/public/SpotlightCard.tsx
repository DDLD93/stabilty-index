"use client";

import Image from "next/image";
import Link from "next/link";

export type StateSpotlight = { state?: string; score?: number; bullets?: string[] };
export type InstitutionSpotlight = {
  institution?: string;
  summary?: string;
  bullets?: string[];
};

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : "";
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export type SpotlightCardProps = {
  stateSpot: StateSpotlight;
  instSpot: InstitutionSpotlight;
  showState: boolean;
  showInst: boolean;
  reportHref: string | null;
};

export function SpotlightCard({
  stateSpot,
  instSpot,
  showState,
  showInst,
  reportHref,
}: SpotlightCardProps) {
  const stateHref = reportHref ? `${reportHref}#state-spotlight` : "/spotlights";
  const instHref = reportHref ? `${reportHref}#institution-spotlight` : "/spotlights";

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
      <div className="nsi-band py-3 text-center text-sm font-bold text-white">
        Monthly Spotlights
      </div>
      <div className="grid md:grid-cols-2">
        {/* State Spotlight */}
        <div
          id="state-spotlight"
          className="flex flex-col border-b border-black/5 p-6 scroll-mt-24 md:border-b-0 md:border-r md:border-black/5"
        >
          <div className="flex items-start gap-4">
            
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                State Spotlight
              </h3>
              {showState ? (
                <>
                  <p className="mt-3 font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
                    {safeString(stateSpot.state) || "State Spotlight"}
                  </p>
                  {safeNumber(stateSpot.score) != null && (
                    <p className="mt-2 text-2xl font-bold text-[color:var(--nsi-green)]">
                      {safeNumber(stateSpot.score)!.toFixed(1)}/10
                    </p>
                  )}
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
                    {safeArray<string>(stateSpot.bullets)
                      .slice(0, 2)
                      .map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                  </ul>
                  <Link
                    href={stateHref}
                    className="mt-6 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                  >
                    Full spotlight
                  </Link>
                </>
              ) : (
                <div className="mt-3 rounded-2xl border border-black/10 overflow-hidden flex h-40 bg-white shadow-lg">
                  <div className="group relative w-1/2 flex items-center justify-center bg-white">
                    <Image
                      src="/spotlights/state-spotlight-logo.png"
                      alt="State Spotlight"
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="w-1/2 bg-[color:var(--nsi-paper-2)] flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                      Coming in this month&apos;s report.
                    </p>
                    <Link
                      href={stateHref}
                      className="mt-4 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                    >
                      View spotlights
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Institution Spotlight */}
        <div
          id="institution-spotlight"
          className="flex flex-col p-6 scroll-mt-24"
        >
          <div className="flex items-start gap-4">
            
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--nsi-ink)]">
                Institution Spotlight
              </h3>
              {showInst ? (
                <>
                  <p className="mt-3 font-serif text-2xl font-semibold text-[color:var(--nsi-ink)]">
                    {safeString(instSpot.institution) || "Institution Spotlight"}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[color:var(--nsi-ink-soft)]">
                    {safeString(instSpot.summary) ||
                      (safeArray<string>(instSpot.bullets)[0] ?? "")}
                  </p>
                  <Link
                    href={instHref}
                    className="mt-6 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                  >
                    Full spotlight
                  </Link>
                </>
              ) : (
                <div className="mt-3 rounded-2xl border border-black/10 overflow-hidden flex h-40 bg-white shadow-lg">
                  <div className="group relative w-1/2 flex items-center justify-center bg-white">
                    <Image
                      src="/spotlights/institution-spotlight-logo.png"
                      alt="Institution Spotlight"
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="w-1/2 bg-[color:var(--nsi-paper-2)] flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-sm text-[color:var(--nsi-ink-soft)]">
                      To be published with the snapshot.
                    </p>
                    <Link
                      href={instHref}
                      className="mt-4 inline-flex rounded-xl bg-[color:var(--nsi-green)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                    >
                      View spotlights
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
