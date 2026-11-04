import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PILLARS } from "@/lib/constants";
import { defaultMetadata } from "@/lib/metadata";
import { photos, pillarPhotos } from "@/lib/photos";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Methodology",
  description:
    "How the Nigeria Stability Index is made: the monthly survey, the five pillars, the 1 to 10 scale, editorial review and publication on the 11th of the following month.",
  alternates: { canonical: "/methodology" },
};

const PILLAR_NOTES: Record<string, string> = {
  Security: "How safe people feel where they live and travel: crime, kidnapping, conflict and the presence of security services.",
  "FX & Economy": "What prices, the naira and incomes mean for households: food and fuel costs, exchange rates and earnings.",
  "Investor Confidence": "Whether people expect businesses to grow, hire and invest, and how open the economy feels to investment.",
  Governance: "How well government at every level serves people: delivery, responsiveness and trust.",
  "Social Stability": "How calm and united communities feel: tensions, cohesion and everyday peace.",
};

const STEPS = [
  {
    title: "The survey opens",
    text: "In the first days of each month a new survey opens with five questions, one per pillar, about the month that has just ended. Anyone can answer, once per device. Field agents also share the survey through referral links.",
  },
  {
    title: "People answer on a 1 to 10 scale",
    text: "Each answer runs from 1 (least stable) to 10 (most stable). An optional last step lets people describe their mood, give one word for Nigeria today, name a state, pick topics and leave a short comment. We don’t ask for names, phone numbers or addresses.",
  },
  {
    title: "Editors review",
    text: "When the survey closes, the team checks the submissions, flags any that look unreliable so they are left out, and reads the answers alongside verified sources: official data, credible reporting and independent assessments.",
  },
  {
    title: "The report is published on the 11th",
    text: "The report is named after the month it covers, so the reading published on 11 November is the October edition. It gives the overall reading and the five pillar scores, all out of 10, a state and an institution spotlight, and what people said. It is then locked and does not change.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Methodology" }]}
        title="How the index is made"
        lede="The index combines a short monthly public survey with editorial review of verified sources. Here is what we ask, how scores are calculated and what the numbers can and can’t tell you."
      />

      <Section className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <h2 className="text-h2">Every month, in four steps</h2>
              <p className="mt-4 text-body text-ink-2">
                The same cycle runs each month, so one month can be compared with the next.
              </p>
              <p className="mt-4 text-body text-ink-2">
                <strong className="text-ink">Every edition reports the previous month.</strong> The survey is taken in
                the first days of a month and asks about the month just ended; the results are published on the 11th.
              </p>
            </div>
            <ol className="reveal-stagger flex flex-col">
              {STEPS.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-6 first:border-ink">
                  <span aria-hidden className="font-serif text-h3 font-semibold text-brand tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-lead font-semibold">{step.title}</h3>
                    <p className="mt-2 max-w-[62ch] text-body text-ink-2">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section tone="surface" id="pillars" className="scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-h2">The five pillars</h2>
            <p className="mt-4 text-lead text-ink-2">
              Each pillar has one survey question. A pillar’s score is the average of everyone’s answers that month, on
              the same 1 to 10 scale.
            </p>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.key}>
                <Figure photo={pillarPhotos[p.key]} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" aspect="3/2" />
                <h3 className="mt-4 font-sans text-lead font-semibold">{p.label}</h3>
                <p className="mt-2 text-body text-ink-2">{PILLAR_NOTES[p.key]}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-[62ch]">
              <h2 className="text-h2">How the scores are calculated</h2>
              <div className="mt-5 flex flex-col gap-4 text-body text-ink-2">
                <p>
                  <strong className="text-ink">Pillar scores (out of 10).</strong> The average of all valid answers to
                  that pillar’s question in the month.
                </p>
                <p>
                  <strong className="text-ink">Overall reading (out of 10).</strong> Each person’s five answers are
                  averaged, giving a personal score from 1 to 10, and the overall reading is the average of those
                  personal scores. The editors review it alongside verified sources and explain the reading in the
                  report.
                </p>
                <p>
                  <strong className="text-ink">Spotlights.</strong> One state and one institution each month, chosen by
                  the editors and described using published evidence. A spotlight is not an endorsement.
                </p>
              </div>
            </div>
            <div className="max-w-[62ch]">
              <h2 className="text-h2">Limits worth knowing</h2>
              <ul className="mt-5 flex list-disc flex-col gap-3 pl-5 text-body text-ink-2">
                <li>
                  The survey is open to anyone. It is not a random sample of all Nigerians, so read the index as a
                  monthly signal, not a precise measure of national opinion.
                </li>
                <li>People who answer online or through field agents may differ from those who don’t.</li>
                <li>One answer per device per month is allowed; flagged answers are excluded.</li>
                <li>Small changes from one month to the next may be noise. Look at the trend across several months.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <Figure photo={photos.newspaperVendor} sizes="(min-width: 1024px) 50vw, 100vw" aspect="3/2" />
            <div>
              <h2 className="text-h2">Using NSI figures</h2>
              <p className="mt-4 text-body text-ink-2">
                You are welcome to quote the index. Please name the month the edition covers, link to the report, and say
                that scores are out of 10. Each report has a ready-made citation
                at the end.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/reports">Browse the reports</LinkButton>
                <LinkButton href="/contact" variant="secondary">
                  Ask about the data
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
