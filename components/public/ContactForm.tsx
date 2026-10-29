"use client";

import { useState } from "react";
import {
  CONTACT_SUBJECT_KEYS,
  CONTACT_SUBJECT_LABELS,
  type ContactSubjectKey,
} from "@/lib/contactSubjects";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#00f59b]/25 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b]";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubjectKey>("general");
  const [subjectOther, setSubjectOther] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          subject,
          ...(subject === "other" ? { subjectOther } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Transmission failed. Please try again.");
        setLoading(false);
        return;
      }

      setDone(true);
      setName("");
      setEmail("");
      setSubject("general");
      setSubjectOther("");
      setMessage("");
    } catch {
      setError("Network interruption. Please check connection and try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-[#00f59b]/40 bg-[#07190f] p-6 text-center font-mono text-xs text-[#00f59b]">
        <div className="text-2xl mb-2">✓</div>
        Transmission logged successfully. An intelligence coordinator will respond to your registered dispatch within 48 business hours.
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={onSubmit}>
      <label className="block">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Full Name / Official Affiliation
        </span>
        <input
          className={inputClass}
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="e.g. Dr. Ngozi Balogun"
          required
        />
      </label>

      <label className="block">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Official Email Address
        </span>
        <input
          className={inputClass}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="analyst@institute.org or personal@email.com"
          required
        />
      </label>

      <label className="block">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Dispatch Category
        </span>
        <select
          className={inputClass}
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as ContactSubjectKey)}
        >
          {CONTACT_SUBJECT_KEYS.map((key) => (
            <option key={key} value={key} className="bg-[#051109] text-white">
              {CONTACT_SUBJECT_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      {subject === "other" && (
        <label className="block">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            Specify Custom Subject
          </span>
          <input
            className={inputClass}
            type="text"
            value={subjectOther}
            onChange={(e) => setSubjectOther(e.target.value)}
            maxLength={120}
            required
          />
        </label>
      )}

      <label className="block">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Inquiry / Telemetry Details
        </span>
        <textarea
          className={`${inputClass} min-h-[130px] resize-y`}
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={3000}
          placeholder="Please outline your research inquiry, data verification request, or institutional feedback…"
          required
        />
      </label>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#00f59b] bg-gradient-to-r from-[#00f59b] to-[#00d07e] py-3.5 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(0,245,155,0.35)] transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "TRANSMITTING DISPATCH…" : "SEND OFFICIAL TRANSMISSION →"}
        </button>
      </div>
    </form>
  );
}
