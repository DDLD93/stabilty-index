import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChangeText } from "@/components/data/ChangeText";
import { PillarTable } from "@/components/data/PillarTable";
import { ScoreBar } from "@/components/data/ScoreBar";
import { ReportContents, type ContentsItem } from "@/components/publication/ReportContents";
import { ShareActions } from "@/components/publication/ShareActions";
import { Container } from "@/components/ui/Layout";
import { Breadcrumb } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import {
  change,
  formatDate,
  formatInstitutionName,
  formatScore,
  formatStateName,
  monthOf,
  OVERALL_MAX,
  type Report,
} from "@/lib/snapshots";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-ink pt-6">
      <h2 id={`${id}-title`} className="text-h3">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * One published edition, laid out for reading: the finding first, the pillar
 * table beside it, then the spotlights, what people said and the sources.
 */
export function ReportArticle({ report, preview = false }: { report: Report; preview?: boolean }) {
  const prev = report.previous;
  const overallChange = change(report.overallScore, prev?.overallScore ?? null);
  const narrative = report.narrative;
  const narrativeIsWord = narrative.length > 0 && !/\s/.test(narrative.trim());
  const url = `/reports/${report.id}`;

  const contents: ContentsItem[] = [
    { id: "pillars", label: "The five pillars" },
    ...(report.state ? [{ id: "state-spotlight", label: "State spotlight" }] : []),
    ...(report.institution ? [{ id: "institution-spotlight", label: "Institution spotlight" }] : []),
    ...(report.streetPulse ? [{ id: "street-pulse-spotlight", label: "Street pulse" }] : []),
    ...(report.sentiment ? [{ id: "what-people-said", label: "What people said" }] : []),
    ...(report.sources.length ? [{ id: "sources", label: "Sources" }] : []),
    { id: "cite", label: "Cite this report" },
  ];

  return (
    <article>
      <header className="border-b border-line pt-8 pb-10 sm:pt-10 sm:pb-12">
        <Container>
          {!preview ? (
            <Breadcrumb
              className="no-print mb-6"
              items={[{ href: "/", label: "Home" }, { href: "/reports", label: "Reports" }, { label: report.period }]}
            />
          ) : null}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <h1 className="text-display">
                {report.period}: the index read {report.overallScore.toFixed(1)} out of 10
              </h1>
              <p className="mt-3 text-small text-ink-3">
                Edition {report.edition} · Published {formatDate(report.publishedAt)}
              </p>
              <p className="mt-5 max-w-2xl text-lead text-ink-2">
                {narrative && !narrativeIsWord ? (
                  narrative
                ) : (
                  <>
                    {overallChange && prev ? (
                      <>
                        The reading was{" "}
                        {overallChange.direction === "same"
                          ? `unchanged from ${prev.period}`
                          : `${overallChange.direction} ${overallChange.value.toFixed(1)} from ${prev.period}`}
                        .{" "}
                      </>
                    ) : null}
                    {narrativeIsWord ? <>The editors’ one-word summary of the month: {narrative.toLowerCase()}.</> : null}
                    {report.sentiment?.topMood ? (
                      <> The word survey respondents used most: {report.sentiment.topMood.toLowerCase()}.</>
                    ) : null}
                  </>
                )}
              </p>
            </div>

            <div className="border-t border-line pt-6 lg:border-t-0 lg:pt-0">
              <p className="flex items-baseline gap-2">
                <span className="text-[3.5rem] leading-none font-semibold tracking-[-0.03em]">{report.overallScore.toFixed(1)}</span>
                <span className="text-body text-ink-2">out of 10</span>
              </p>
              <ScoreBar
                className="mt-4"
                value={report.overallScore}
                previous={prev?.overallScore ?? null}
                max={OVERALL_MAX}
                label={`${report.overallScore.toFixed(1)} out of 10${prev ? `; ${prev.period}: ${prev.overallScore.toFixed(1)}` : ""}`}
              />
              <p className="mt-3 text-small">
                {prev ? <ChangeText change={overallChange} since={prev.period} /> : <span className="text-ink-2">First published edition</span>}
              </p>
              {!preview ? (
                <div className="mt-6">
                  <ShareActions title={`Nigeria Stability Index, ${report.period}`} url={url} />
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0">
            <ReportContents items={contents} />
          </aside>

          <div className="flex min-w-0 max-w-4xl flex-col gap-14">
            <Section id="pillars" title="The five pillars">
              <p className="mb-4 max-w-2xl text-body text-ink-2">
                Each pillar is the average of public answers on a scale of 1 to 5.
                {prev ? ` The black tick shows ${prev.period}.` : null}{" "}
                <Link href="/methodology#pillars" className="text-brand underline underline-offset-[0.22em]">
                  What each pillar measures
                </Link>
              </p>
              {report.pillars.length ? (
                <PillarTable
                  pillars={report.pillars}
                  previous={prev?.pillars}
                  previousLabel={prev ? monthOf(prev.period) : undefined}
                  caption={`Pillar scores for ${report.period}, out of 5`}
                />
              ) : (
                <p className="text-body text-ink-2">Pillar scores were not published for this edition.</p>
              )}
            </Section>

            {report.state ? (
              <Section id="state-spotlight" title={`State spotlight: ${formatStateName(report.state.state) || "—"}`}>
                {report.state.score !== null ? (
                  <p className="mb-4 text-body">
                    Spotlight score: <strong className="tabular-nums">{formatScore(report.state.score)}</strong> out of 10
                  </p>
                ) : null}
                <RichText html={report.state.html} className="max-w-[68ch]" />
              </Section>
            ) : null}

            {report.institution ? (
              <Section
                id="institution-spotlight"
                title={`Institution spotlight: ${formatInstitutionName(report.institution.institution) || "—"}`}
              >
                {report.institution.summary ? <p className="mb-4 max-w-[68ch] text-lead text-ink">{report.institution.summary}</p> : null}
                <RichText html={report.institution.html} className="max-w-[68ch]" />
              </Section>
            ) : null}

            {report.streetPulse ? (
              <Section id="street-pulse-spotlight" title={report.streetPulse.title ? `Street pulse: ${report.streetPulse.title}` : "Street pulse"}>
                {report.streetPulse.summary ? <p className="mb-4 max-w-[68ch] text-lead text-ink">{report.streetPulse.summary}</p> : null}
                <RichText html={report.streetPulse.html} className="max-w-[68ch]" />
              </Section>
            ) : null}

            {report.sentiment ? (
              <Section id="what-people-said" title="What people said">
                <dl className="grid gap-6 sm:grid-cols-3">
                  {report.sentiment.topMood ? (
                    <div>
                      <dt className="text-small text-ink-2">Most common word</dt>
                      <dd className="mt-1 font-serif text-h2 font-semibold">{report.sentiment.topMood.toLowerCase()}</dd>
                    </div>
                  ) : null}
                  {report.sentiment.topWords.length > 1 ? (
                    <div className="sm:col-span-2">
                      <dt className="text-small text-ink-2">Other words that came up often</dt>
                      <dd className="mt-2 text-lead">
                        {report.sentiment.topWords
                          .filter((w) => w.toLowerCase() !== report.sentiment?.topMood.toLowerCase())
                          .map((w) => w.toLowerCase())
                          .join(", ")}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Section>
            ) : null}

            {report.sources.length ? (
              <Section id="sources" title="Sources">
                <ol className="list-decimal space-y-2 pl-6 text-body">
                  {report.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-[0.22em]">
                        {s.label}
                      </a>{" "}
                      <span className="text-small text-ink-3">({new URL(s.url).hostname.replace(/^www\./, "")})</span>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            <Section id="cite" title="Cite this report">
              <p className="max-w-[68ch] bg-surface px-5 py-4 text-small break-words text-ink-2 [overflow-wrap:anywhere]">
                Nigeria Stability Index ({report.publishedAt.getFullYear()}). <em>{report.period}</em>, edition {report.edition}. Published{" "}
                {formatDate(report.publishedAt)}. nigeriastabilityindex.ng{url}
              </p>
            </Section>

            {!preview && (report.previous || report.next) ? (
              <nav aria-label="Other editions" className="no-print grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
                {report.previous ? (
                  <Link href={`/reports/${report.previous.id}`} className="group flex min-h-16 flex-col justify-center">
                    <span className="flex items-center gap-1.5 text-small text-ink-3">
                      <ArrowLeft aria-hidden className="size-4" /> Previous edition
                    </span>
                    <span className="font-semibold text-brand underline-offset-[0.22em] group-hover:underline">
                      {report.previous.period} · {report.previous.overallScore.toFixed(1)}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {report.next ? (
                  <Link href={`/reports/${report.next.id}`} className="group flex min-h-16 flex-col justify-center sm:items-end sm:text-right">
                    <span className="flex items-center gap-1.5 text-small text-ink-3">
                      Next edition <ArrowRight aria-hidden className="size-4" />
                    </span>
                    <span className="font-semibold text-brand underline-offset-[0.22em] group-hover:underline">
                      {report.next.period} · {report.next.overallScore.toFixed(1)}
                    </span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </Container>
    </article>
  );
}
