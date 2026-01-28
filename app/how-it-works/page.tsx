export default function HowItWorksPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-card rounded-[30px] px-8 py-9">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">How it works</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-black/70">
          NSI runs in monthly cycles: we collect anonymous public sentiment, close collection to process inputs, then
          publish a snapshot that stays stable once locked.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="nsi-card-solid rounded-[28px] p-8">
          <div className="text-xs font-semibold text-black/60">1) Collection</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">Public check-in</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Visitors share a 1–10 stability score, a mood, a one-word descriptor, and optionally a state spotlight.
          </p>
        </div>
        <div className="nsi-card-solid rounded-[28px] p-8">
          <div className="text-xs font-semibold text-black/60">2) Processing</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">Review and synthesis</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Admins can review submissions, flag entries, and prepare the official snapshot narrative and pillar scores.
          </p>
        </div>
        <div className="nsi-card-solid rounded-[28px] p-8">
          <div className="text-xs font-semibold text-black/60">3) Publication</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">Publish and lock</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            When published, the snapshot becomes the public dashboard. Locking makes the snapshot immutable.
          </p>
        </div>
      </section>
    </main>
  );
}

