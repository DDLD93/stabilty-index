"use client";

import { useState } from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-card rounded-[30px] px-8 py-9">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">Subscribe for updates</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-black/70">
          Get monthly NSI updates and new report releases. (This demo UI doesn’t store emails yet.)
        </p>
      </section>

      <section className="mt-10 overflow-hidden rounded-[28px] border-2 border-white/20 bg-[color:var(--nsi-green)]">
        <div className="grid gap-6 px-8 py-9 md:grid-cols-2 md:items-center">
          <div className="text-white">
            <div className="text-xl font-semibold">Be part of Nigeria’s stability check-in.</div>
            <div className="mt-1 text-sm opacity-85">Get monthly updates and reports.</div>
          </div>

          <div>
            {done ? (
              <div className="rounded-md border border-white/25 bg-white/10 px-5 py-4 text-sm text-white">
                Thanks — you’re on the list (demo).
              </div>
            ) : (
              <form
                className="flex flex-col gap-3 sm:flex-row sm:justify-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <input
                  className="h-11 w-full rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/40 sm:max-w-xs"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--nsi-gold)] px-6 text-sm font-semibold text-black hover:brightness-[0.98]"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

