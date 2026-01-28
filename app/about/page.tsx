export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <section className="nsi-card rounded-[30px] px-8 py-9">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">
          About the Nigeria Stability Index
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-black/70">
          The Nigeria Stability Index (NSI) is a civic pulse-check tracking how Nigeria is holding together through calm,
          structured monthly snapshots across security, economy, governance, investor confidence, and social stability.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="nsi-card-solid rounded-[28px] p-8">
          <div className="text-xs font-semibold text-black/60">What we measure</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">A calm monthly pulse</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            A mix of public check-ins and editorial analysis, summarized into an overall score and five pillar scores with
            short narratives.
          </p>
        </div>

        <div className="nsi-card-solid rounded-[28px] p-8">
          <div className="text-xs font-semibold text-black/60">What we don’t collect</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--nsi-ink)]">No personal identifiers</h2>
          <p className="mt-3 text-sm leading-6 text-black/70">
            The check-in form stores no personal identifiers. Please avoid sharing names, phone numbers, or addresses in
            submissions.
          </p>
        </div>
      </section>
    </main>
  );
}

