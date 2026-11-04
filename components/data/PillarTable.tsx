import { ChangeText } from "@/components/data/ChangeText";
import { ScoreBar } from "@/components/data/ScoreBar";
import { change, formatScore, PILLAR_MAX, PILLAR_MIN, type PillarScore } from "@/lib/reportFormat";
import { cn } from "@/lib/utils";

/** Editors' pillar notes arrive in mixed styles ("Tired", "Capital is cautious."): show them in one register. */
function tidyNote(note: string): string {
  const s = note.trim().replace(/[.;,\s]+$/, "");
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * The five pillar scores for one edition as a real table: name, score out of 10,
 * a bar on the 0–10 scale, and the change from the previous edition.
 * Rows stack into blocks on small screens.
 */
export function PillarTable({
  pillars,
  previous,
  previousLabel,
  caption,
  className,
}: {
  pillars: PillarScore[];
  previous?: PillarScore[];
  previousLabel?: string;
  caption: string;
  className?: string;
}) {
  const prevBy = new Map((previous ?? []).map((p) => [p.title.toLowerCase(), p.score]));

  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <caption className="sr-only">{caption}</caption>
      <thead className="max-md:sr-only">
        <tr className="border-b border-line text-meta text-ink-3">
          <th scope="col" className="py-3 pr-4 font-semibold">Pillar</th>
          <th scope="col" className="w-[38%] py-3 pr-6 font-semibold">
            <span className="sr-only">Score on a {PILLAR_MIN} to {PILLAR_MAX} scale</span>
            <span aria-hidden className="flex justify-between tabular-nums">
              <span>{PILLAR_MIN}</span>
              <span>{PILLAR_MAX}</span>
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-semibold">Score (of {PILLAR_MAX})</th>
          {previous ? (
            <th scope="col" className="py-3 text-right font-semibold">
              Change{previousLabel ? <span className="sr-only"> from {previousLabel}</span> : null}
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {pillars.map((p) => {
          const prev = prevBy.get(p.title.toLowerCase()) ?? null;
          const c = change(p.score, prev);
          return (
            <tr key={p.title} className="border-b border-line align-top max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-2 max-md:py-4">
              <th scope="row" className="py-4 pr-4 text-left font-semibold text-ink max-md:col-start-1 max-md:row-start-1 max-md:py-0">
                {p.title}
                {p.summary ? (
                  <span className="mt-1 block text-small font-normal text-ink-2">
                    <span className="text-ink-3">Editors’ note: </span>
                    {tidyNote(p.summary)}
                  </span>
                ) : null}
              </th>
              <td className="py-5 pr-6 max-md:col-span-2 max-md:row-start-2 max-md:py-1">
                <ScoreBar value={p.score} previous={prev} min={PILLAR_MIN} max={PILLAR_MAX} />
              </td>
              <td className="py-4 pr-4 text-right text-lead font-semibold tabular-nums max-md:col-start-2 max-md:row-start-1 max-md:py-0 max-md:pr-0">
                {formatScore(p.score)}
                <span className="sr-only"> out of {PILLAR_MAX}</span>
              </td>
              {previous ? (
                <td className="py-4 text-right text-small max-md:col-span-2 max-md:row-start-3 max-md:py-0 max-md:text-left">
                  <ChangeText change={c} since={previousLabel} compact />
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
