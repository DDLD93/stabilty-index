import type { Metadata } from "next";
import Link from "next/link";
import { defaultMetadata } from "@/lib/metadata";
import { NSIShieldMark } from "@/components/public/icons";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Data Privacy & Neutrality Charter | Sovereign Observatory",
  description:
    "Data privacy and cryptographic anonymity protocols governing the Nigeria Stability Index civic measurement framework.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Data Privacy & Neutrality Charter | Nigeria Stability Index",
    description: "How citizen survey telemetry and device hashes are protected with zero personal data retention.",
    url: `${defaultMetadata.metadataBase ?? ""}privacy`,
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-[90vh] w-full pb-24 pt-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#00f59b]/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-[#f59e0b]/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f59b08_1px,transparent_1px),linear-gradient(to_bottom,#00f59b08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6">
        {/* Header Card */}
        <div className="observatory-card p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#00f59b]/15 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00f59b]/40 bg-[#07190f] p-2 shadow-[0_0_20px_rgba(0,245,155,0.25)]">
                <NSIShieldMark className="h-10 w-10 text-[#00f59b]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
                    DATA ETHICS CHARTER
                  </span>
                  <span className="rounded bg-[#00f59b]/15 px-2 py-0.5 font-mono text-[10px] text-[#00f59b] border border-[#00f59b]/30">
                    ZERO PII
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Privacy & Data Governance
                </h1>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-400">
              NDPR & GDPR COMPLIANT
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300">
            The <strong>Nigeria Stability Index (NSI)</strong> operates on a strict principle of data minimization. 
            Because stability intelligence must be free from intimidation or surveillance, our system is engineered 
            from the ground up to guarantee total anonymity for participating citizens.
          </p>
        </div>

        {/* Policies Grid */}
        <div className="mt-10 space-y-6">
          <div className="observatory-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f59b]">
              ANONYMIZED TELEMETRY
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold text-white">
              No Personal Identifiable Information (PII)
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              The monthly citizen survey form never records names, phone numbers, email addresses, or physical street addresses. 
              Submissions capture solely numerical ratings (1–5), optional state selections, and qualitative mood descriptors.
            </p>
          </div>

          <div className="observatory-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
              ONE DEVICE, ONE VOTE PROTECTION
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold text-white">
              Cryptographic Device Fingerprinting
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              To defend index calculations against automated bot spam or ballot-stuffing campaigns, a one-way irreversible 
              SHA-256 hash is computed in the client browser. This allows our backend to verify uniqueness per cycle without 
              ever tracking or associating you across visits.
            </p>
          </div>

          <div className="observatory-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              NO COMMERCIAL DATA MONETIZATION
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold text-white">
              Civic Public Good Commitment
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              We run zero third-party commercial advertising trackers, surveillance pixels, or marketing beacons. 
              The NSI dataset exists exclusively to advance factual public understanding and institutional accountability across Nigeria.
            </p>
          </div>

          <div className="observatory-card p-8">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#f43f5e]">
              QUESTIONS & DATA RIGHTS
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold text-white">
              Direct Contact
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              For any questions regarding data governance or our privacy architecture, reach the legal and research desk at{" "}
              <a href="mailto:info@nigeriastabilityindex.org" className="text-[#00f59b] underline">
                info@nigeriastabilityindex.org
              </a>.
            </p>
            <div className="mt-4">
              <Link href="/contact" className="font-mono text-xs font-semibold text-[#00f59b] hover:text-[#fbbf24] transition-colors">
                Contact Coordination Desk →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
