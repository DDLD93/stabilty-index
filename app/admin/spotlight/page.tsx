import { SpotlightFeed } from "@/components/admin/SpotlightFeed";

export const dynamic = "force-dynamic";

export default function AdminSpotlightPage() {
  return (
    <main className="w-full pb-20">
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="nsi-section-card px-8 py-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-[color:var(--nsi-ink)] backdrop-blur-md">
                Admin
              </div>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
                State spotlight feed
              </h1>
              <p className="mt-3 text-sm text-[color:var(--nsi-ink-soft)]">
                Filter spotlight submissions by state (flagged entries excluded).
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto mt-10 w-full max-w-6xl px-6">
        <SpotlightFeed />
      </div>
    </main>
  );
}

