import { SpotlightFeed } from "@/components/admin/SpotlightFeed";

export const dynamic = "force-dynamic";

export default function AdminSpotlightPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-[color:var(--nsi-green)]">
        State spotlight feed
      </h1>
      <p className="mt-2 text-sm text-black/70">Filter spotlight submissions by state (flagged entries excluded).</p>
      <div className="mt-8">
        <SpotlightFeed />
      </div>
    </main>
  );
}

