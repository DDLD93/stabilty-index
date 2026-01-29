"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Subscribe
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)] lg:text-5xl">
                Monthly updates from the stability desk
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
                Get monthly NSI updates and new report releases. We use your email
                only to send these updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-7xl px-6">
        <div className="nsi-newsletter-section p-12 md:p-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-[color:var(--nsi-paper)]/90" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-4xl font-bold leading-tight text-[color:var(--nsi-ink)]">
                Be part of Nigeria&apos;s <br />
                <span className="text-[color:var(--nsi-green)]">stability check-in.</span>
              </h2>
              <p className="mt-6 text-xl text-[color:var(--nsi-ink-soft)]">
                Get monthly updates and deep-dive reports directly to your inbox.
              </p>
            </div>

            <div>
              {done ? (
                <div className="rounded-xl border border-black/10 bg-white/70 px-6 py-5 text-sm text-[color:var(--nsi-ink)] shadow-sm">
                  Thanks — you&apos;re on the list. We&apos;ll send you updates when new snapshots are published.
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                >
                  <input
                    className="h-16 flex-1 rounded-xl border border-black/10 bg-white/70 px-6 text-[color:var(--nsi-ink)] placeholder:text-black/30 outline-none transition-all focus:border-[color:var(--nsi-green)] focus:bg-white"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    className="h-16 rounded-xl bg-[color:var(--nsi-gold)] px-10 text-lg font-bold text-[color:var(--nsi-ink)] shadow-2xl transition-all hover:scale-105 hover:brightness-110"
                    type="submit"
                  >
                    Join Us
                  </button>
                </form>
              )}
            </div>
          </div>
          <p className="mt-8 text-[0.8125rem] text-[color:var(--nsi-ink-soft)]">
            We use your email only to send monthly updates. No spam. No sharing with third parties. Unsubscribe anytime via the link in our emails or by contacting us. See our{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[color:var(--nsi-green)]">
              Privacy
            </Link>{" "}
            page for more.
          </p>
        </div>
      </section>
    </main>
  );
}
