"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-section-card rounded-[30px] px-8 py-9">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          Subscribe for updates
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--nsi-ink-soft)]">
          Get monthly NSI updates and new report releases. We use your email
          only to send these updates.
        </p>
      </section>

      <section className="nsi-newsletter-section mt-10 overflow-hidden rounded-[28px]">
        <div className="grid gap-6 px-8 py-10 md:grid-cols-2 md:items-center md:px-10">
          <div className="text-white">
            <h2 className="text-xl font-semibold">
              Be part of Nigeria&apos;s stability check-in
            </h2>
            <p className="mt-2 text-sm opacity-85">
              Get monthly updates and reports.
            </p>
          </div>

          <div>
            {done ? (
              <div className="rounded-lg border border-white/25 bg-white/12 px-5 py-4 text-sm text-white">
                Thanks — you&apos;re on the list. We&apos;ll send you updates
                when new snapshots are published.
              </div>
            ) : (
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <input
                  className="h-12 w-full rounded-lg border border-white/25 bg-white/12 px-5 text-sm text-white placeholder:text-white/55 outline-none transition-all focus:border-white/45 focus:bg-white/18 sm:max-w-[280px]"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[color:var(--nsi-gold)] px-8 text-sm font-semibold text-[color:var(--nsi-ink)] transition-all hover:brightness-[0.96]"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        <p className="border-t border-white/12 px-8 pb-8 pt-4 text-[0.8125rem] text-white/70 md:px-10">
          We use your email only to send monthly updates. No spam. No sharing
          with third parties. Unsubscribe anytime via the link in our emails or
          by contacting us. See our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:opacity-90"
          >
            Privacy
          </Link>{" "}
          page for more.
        </p>
      </section>
    </main>
  );
}
