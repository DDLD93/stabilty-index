"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="w-full pb-24">
      <section className="border-b-2 border-[color:var(--nsi-ink)] bg-[color:var(--nsi-green-deep)] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
          <p className="nsi-kicker-light">Executive Briefing · Monthly Dispatch</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Monthly updates from the stability desk
          </h1>
          <p className="mt-5 max-w-2xl border-l-2 border-[color:var(--nsi-gold)] pl-5 text-base leading-relaxed text-white/80">
            Receive monthly NSI snapshots, sub-national spotlight dossiers, and
            new report releases on the 11th of each month. We use your email
            strictly to send these research briefings.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-6">
        <div className="overflow-hidden rounded-[4px] border border-[color:var(--nsi-rule-strong)] border-t-4 border-t-[color:var(--nsi-gold)] bg-white shadow-sm">
          <div className="grid lg:grid-cols-12">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
              <span className="nsi-kicker">Direct Research Dispatch</span>
              <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-[color:var(--nsi-ink)] sm:text-4xl">
                Be part of Nigeria&apos;s{" "}
                <span className="text-[color:var(--nsi-green)]">
                  stability check-in.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--nsi-ink-soft)]">
                Get monthly empirical updates and deep-dive stability reports
                delivered directly to your inbox upon publication.
              </p>

              <div className="mt-8">
                {done ? (
                  <div className="rounded-[3px] border border-[color:var(--nsi-green)]/30 bg-[color:var(--nsi-emerald-tint)] px-6 py-5 text-sm font-medium text-[color:var(--nsi-green)]">
                    Thanks — you&apos;re on the dispatch list. We&apos;ll send you updates
                    when new monthly snapshots are published.
                  </div>
                ) : (
                  <form
                    className="flex flex-col gap-3 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setDone(true);
                    }}
                  >
                    <input
                      className="h-13 flex-1 rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-4 text-sm text-[color:var(--nsi-ink)] placeholder:text-black/40 outline-none transition-colors focus:border-[color:var(--nsi-green)] focus:bg-white"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      className="btn-nsi-primary h-13 shrink-0 px-8"
                      type="submit"
                    >
                      Join Dispatch
                    </button>
                  </form>
                )}
              </div>

              <p className="mt-6 text-xs leading-relaxed text-[color:var(--nsi-ink-muted)]">
                We use your email only to send monthly updates. No spam. No
                sharing with third parties. Unsubscribe anytime via the link in
                our emails or by contacting us. See our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[color:var(--nsi-green)] underline underline-offset-2"
                >
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </div>

            <div className="relative min-h-[280px] lg:col-span-5">
              <Image
                src="/images/nigeria-citizens-dialogue.jpg"
                alt="Nigerian policy and civic dialogue"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
