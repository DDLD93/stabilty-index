"use client";

import { useState } from "react";
import {
  CONTACT_SUBJECT_KEYS,
  CONTACT_SUBJECT_LABELS,
  type ContactSubjectKey,
} from "@/lib/contactSubjects";

const inputClass =
  "mt-1.5 w-full rounded-[3px] border border-[color:var(--nsi-rule-strong)] bg-[color:var(--nsi-paper)] px-4 py-3 text-sm text-[color:var(--nsi-ink)] outline-none transition-colors focus:border-[color:var(--nsi-green)] focus:bg-white";

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
        setError(data.error ?? "Something went wrong. Please try again.");
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
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="mt-6 rounded-[3px] border border-[color:var(--nsi-green)]/30 bg-[color:var(--nsi-emerald-tint)] px-6 py-5 text-sm font-medium text-[color:var(--nsi-green)]">
        Thank you — your message has been sent to the NSI desk. We aim to reply
        within a few business days.
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
            Name
          </span>
          <input
            className={inputClass}
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            required
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
            Email
          </span>
          <input
            className={inputClass}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
          Subject
        </span>
        <select
          className={inputClass}
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as ContactSubjectKey)}
          required
        >
          {CONTACT_SUBJECT_KEYS.map((key) => (
            <option key={key} value={key}>
              {CONTACT_SUBJECT_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      {subject === "other" ? (
        <label className="block">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
            Please specify
          </span>
          <input
            className={inputClass}
            type="text"
            name="subjectOther"
            value={subjectOther}
            onChange={(e) => setSubjectOther(e.target.value)}
            maxLength={200}
            placeholder="Brief topic for your message"
            required
          />
        </label>
      ) : null}

      <label className="block">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--nsi-ink)]">
          Message
        </span>
        <textarea
          className={`${inputClass} min-h-[140px] resize-y`}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={4000}
          required
        />
      </label>

      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="btn-nsi-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
