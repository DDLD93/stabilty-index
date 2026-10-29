"use client";

import { useState } from "react";
import Link from "next/link";
import { NSIShieldMark } from "@/components/public/icons";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6">
        {/* Header Card */}
        <div className="observatory-card p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#00f59b]/15 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#07190f] p-2 shadow-[0_0_20px_rgba(0,245,155,0.25)]">
                <NSIShieldMark className="h-10 w-10 text-[#00f59b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
                    INTELLIGENCE DISPATCHES
                  </span>
                  <span className="rounded bg-[#fbbf24]/15 px-2 py-0.5 font-mono text-[10px] text-[#fbbf24] border border-[#fbbf24]/30">
                    MONTHLY BRIEFINGS
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Executive Briefings & Data Feeds
                </h1>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-400">
              CADENCE: <span className="text-[#00f59b]">1ST OF MONTH</span>
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300">
            Subscribe to receive direct PDF declassifications, sub-national data files, and geopolitical briefings 
            delivered straight to your inbox each calendar cycle.
          </p>
        </div>

        {/* Subscribe Action Box */}
        <div className="mt-10 observatory-card p-8 sm:p-12">
          {done ? (
            <div className="rounded-xl border border-[#00f59b]/40 bg-[#07190f] p-8 text-center font-mono text-xs text-[#00f59b]">
              <div className="text-3xl mb-3">✓</div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Registration Confirmed</h3>
              You have been enrolled in the Monthly Sovereign Intelligence Dispatch. Upcoming reports will transmit to <strong>{email}</strong>.
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Enter Your Delivery Coordinates
              </h2>
              <p className="mt-1 font-mono text-xs text-slate-400">
                Institutional researchers, journalists, civic leaders, and sovereign analysts.
              </p>

              <form
                className="mt-6 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <input
                  className="h-14 flex-1 rounded-xl border border-[#00f59b]/25 bg-black/60 px-5 font-mono text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b]"
                  type="email"
                  placeholder="analyst@institution.ng or personal@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="h-14 rounded-xl border border-[#00f59b] bg-[#00f59b] px-8 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(0,245,155,0.35)] transition-all hover:bg-[#22ffb0] hover:scale-105 shrink-0"
                  type="submit"
                >
                  ENROLL IN DISPATCH →
                </button>
              </form>

              <p className="mt-6 text-xs text-slate-500 font-mono">
                Strict privacy guarantee: Zero commercial tracking or data selling. One-click unsubscribe on any dispatch. 
                Read our <Link href="/privacy" className="text-[#00f59b] hover:underline">Privacy Charter</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
