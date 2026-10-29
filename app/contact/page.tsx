import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/ContactForm";
import { defaultMetadata } from "@/lib/metadata";
import { NSIShieldMark } from "@/components/public/icons";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact Field Bureau | Sovereign Observatory Communications",
  description:
    "Direct communications channel with the Nigeria Stability Index field bureau and research team in Abuja FCT.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Contact Field Bureau | Nigeria Stability Index",
    description: "Submit institutional inquiries, academic collaborations, or data verification requests.",
    url: `${defaultMetadata.metadataBase ?? ""}contact`,
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
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
                    COORDINATION DESK
                  </span>
                  <span className="rounded bg-[#00f59b]/15 px-2 py-0.5 font-mono text-[10px] text-[#00f59b] border border-[#00f59b]/30">
                    ABUJA FCT HQ
                  </span>
                </div>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Direct Field Bureau Contact
                </h1>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-400">
              <span className="text-[#00f59b]">STATUS:</span> ONLINE
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300">
            For academic inquiries, methodological audits, data sharing partnerships, or editorial feedback, 
            transmit your dispatch below. Official correspondence is reviewed by the NSI Research Bureau.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="mt-10 observatory-card p-8 sm:p-10">
          <h2 className="font-serif text-2xl font-bold text-white">
            Transmit Official Dispatch
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-400">
            All fields are encrypted and delivered directly to the project directorate.
          </p>

          <ContactForm />

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-slate-400">
            <div>
              DIRECT EMAIL:{" "}
              <a href="mailto:info@nigeriastabilityindex.org" className="text-[#00f59b] hover:underline">
                info@nigeriastabilityindex.org
              </a>
            </div>
            <div>
              SPONSOR: <span className="text-[#fbbf24]">The 24 Angels Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
